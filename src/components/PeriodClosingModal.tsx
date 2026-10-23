import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatEuro,
  generateWhatsAppClosingText,
  calculateNetEstimate,
  SS_DISCLAIMER,
} from '../utils/taxCalculator';
import { jsPDF } from 'jspdf';

type PeriodFilterType = 'current_month' | 'last_month' | 'first_half' | 'second_half' | 'custom';

export const PeriodClosingModal: React.FC = () => {
  const {
    isPeriodClosingModalOpen,
    setIsPeriodClosingModalOpen,
    clients,
    workLogs,
    user,
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [periodType, setPeriodType] = useState<PeriodFilterType>('current_month');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Calculate Date Boundaries based on Period Selection
  const { startDate, endDate, periodLabel } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    if (periodType === 'current_month') {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      return {
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
        periodLabel: `${monthNames[currentMonth]} de ${currentYear}`,
      };
    }

    if (periodType === 'last_month') {
      const firstDay = new Date(currentYear, currentMonth - 1, 1);
      const lastDay = new Date(currentYear, currentMonth, 0);
      const lastMonthIndex = (currentMonth - 1 + 12) % 12;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return {
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
        periodLabel: `${monthNames[lastMonthIndex]} de ${lastMonthYear}`,
      };
    }

    if (periodType === 'first_half') {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const day15 = new Date(currentYear, currentMonth, 15);
      return {
        startDate: firstDay.toISOString().split('T')[0],
        endDate: day15.toISOString().split('T')[0],
        periodLabel: `1ª Quinzena de ${monthNames[currentMonth]} (1 a 15)`,
      };
    }

    if (periodType === 'second_half') {
      const day16 = new Date(currentYear, currentMonth, 16);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      return {
        startDate: day16.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
        periodLabel: `2ª Quinzena de ${monthNames[currentMonth]} (16 a ${lastDay.getDate()})`,
      };
    }

    // Custom
    return {
      startDate: customStartDate,
      endDate: customEndDate,
      periodLabel: `${customStartDate} até ${customEndDate}`,
    };
  }, [periodType, customStartDate, customEndDate]);

  // Filter logs by client and date range
  const filteredLogs = useMemo(() => {
    return workLogs.filter((log) => {
      if (selectedClientId !== 'all' && log.clientId !== selectedClientId) {
        return false;
      }
      if (!log.date) return false;
      return log.date >= startDate && log.date <= endDate;
    }).sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [workLogs, selectedClientId, startDate, endDate]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Totals
  const totalHours = filteredLogs.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);
  const totalGross = filteredLogs.reduce((acc, curr) => acc + (curr.totalEarnings || 0), 0);
  const averageRate = totalHours > 0 ? totalGross / totalHours : (selectedClient?.rate ?? 0);

  const retentionTaxRate = selectedClient?.retentionRate ?? 25;
  const netEstimate = calculateNetEstimate(totalGross, retentionTaxRate);

  if (!isPeriodClosingModalOpen) return null;

  // WhatsApp Closing Text
  const whatsAppMessage = generateWhatsAppClosingText({
    periodLabel,
    totalHours,
    hourlyRate: averageRate,
    totalAmount: totalGross,
    clientName: selectedClient ? selectedClient.name : undefined,
  });

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(whatsAppMessage);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = whatsAppMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsAppMessage);
    const url = selectedClient?.phone
      ? `https://wa.me/${selectedClient.phone.replace(/[^0-9]/g, '')}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  // PDF Generation with jsPDF
  const handleExportPDF = () => {
    setPdfGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const clientName = selectedClient ? selectedClient.name : 'Todos os Clientes';
      const emitDate = new Date().toLocaleDateString('pt-PT');

      // Top Header Brand Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 32, 'F');

      // Brand Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('TEMPO & GANHO', 14, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('Gestão de Horas & Faturação para Recibos Verdes em Portugal', 14, 22);

      doc.setFontSize(8);
      doc.text(`Emitido em: ${emitDate}`, 196, 22, { align: 'right' });

      // Title Section
      let currentY = 42;
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('EXTRATO DE HORAS TRABALHADAS', 14, currentY);

      // Meta info
      currentY += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Cliente:', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(clientName, 32, currentY);

      doc.setFont('helvetica', 'bold');
      doc.text('Período:', 115, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(periodLabel, 132, currentY);

      // Professional Summary Box
      currentY += 7;
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(14, currentY, 182, 24, 3, 3, 'FD');

      const col1 = 20;
      const col2 = 68;
      const col3 = 115;
      const col4 = 160;

      // Box Labels
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL HORAS', col1, currentY + 7);
      doc.text('VALOR ACORDADO', col2, currentY + 7);
      doc.text('TOTAL BRUTO', col3, currentY + 7);
      doc.text('LÍQUIDO ESTIMADO', col4, currentY + 7);

      // Box Values
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${totalHours.toFixed(1)}h`, col1, currentY + 16);
      doc.text(`${formatEuro(averageRate)}/h`, col2, currentY + 16);

      doc.setTextColor(2, 132, 199); // primary sky-600
      doc.text(formatEuro(totalGross), col3, currentY + 16);

      doc.setTextColor(16, 185, 129); // emerald-500
      doc.text(formatEuro(netEstimate.netEstimated), col4, currentY + 16);

      // Table Header
      currentY += 34;
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(14, currentY, 182, 8, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('DATA', 18, currentY + 5.5);
      doc.text('INÍCIO', 44, currentY + 5.5);
      doc.text('FIM', 66, currentY + 5.5);
      doc.text('PAUSA', 88, currentY + 5.5);
      doc.text('TOTAL HORAS', 115, currentY + 5.5);
      doc.text('VALOR/H', 145, currentY + 5.5);
      doc.text('TOTAL (€)', 192, currentY + 5.5, { align: 'right' });

      // Table Rows
      currentY += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      if (filteredLogs.length === 0) {
        doc.setTextColor(148, 163, 184);
        doc.text('Nenhum registo de horas encontrado neste período.', 14, currentY + 10);
        currentY += 20;
      } else {
        filteredLogs.forEach((log, index) => {
          // Check for page overflow
          if (currentY > 265) {
            doc.addPage();
            currentY = 20;
          }

          if (index % 2 === 1) {
            doc.setFillColor(250, 250, 250);
            doc.rect(14, currentY, 182, 7, 'F');
          }

          doc.setTextColor(15, 23, 42);
          doc.text(log.date || '-', 18, currentY + 5);
          doc.text(log.startTime || '-', 44, currentY + 5);
          doc.text(log.endTime || '-', 66, currentY + 5);
          doc.text(log.pauseMinutes ? `${log.pauseMinutes}m` : '0m', 88, currentY + 5);
          doc.text(`${(log.totalHours || 0).toFixed(1)}h`, 115, currentY + 5);
          doc.text(formatEuro(log.hourlyRate || 0), 145, currentY + 5);
          doc.setFont('helvetica', 'bold');
          doc.text(formatEuro(log.totalEarnings || 0), 192, currentY + 5, { align: 'right' });
          doc.setFont('helvetica', 'normal');

          currentY += 7;
        });
      }

      // Fiscal Decomposing Note
      currentY += 8;
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, currentY, 182, 26, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text('Decomposição Fiscal Indicativa (Recibos Verdes):', 18, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`• Faturação Bruta: ${formatEuro(totalGross)}`, 18, currentY + 12);
      doc.text(`• Retenção na Fonte IRS (${retentionTaxRate}%): - ${formatEuro(netEstimate.retentionIrs)}`, 18, currentY + 17);
      doc.text(`• Segurança Social Estimada (21,4% de 70%): - ${formatEuro(netEstimate.socialSecurityEstimate)}`, 18, currentY + 22);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text(`• Líquido Estimado Final: ${formatEuro(netEstimate.netEstimated)}`, 115, currentY + 17);

      // Disclaimer Footer
      currentY += 32;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text(`Nota: ${SS_DISCLAIMER}`, 14, currentY);
      doc.text('Documento de conferência de horas para apoio à emissão de Fatura-Recibo no Portal das Finanças.', 14, currentY + 4);

      // Download PDF
      const cleanClient = clientName.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Fecho_${cleanClient}_${startDate}_a_${endDate}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsPeriodClosingModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-outline-variant/30 my-auto animate-fade-in-up relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 pb-4 border-b border-outline-variant/20 bg-surface-container-lowest shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
            </div>
            <div>
              <h2 className="text-lg font-bold font-headline-lg text-on-surface">
                Fecho de Período & Exportação
              </h2>
              <p className="text-xs text-on-surface-variant">
                Relatório de horas para faturação e recibos verdes
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPeriodClosingModalOpen(false)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Filters Bar: Client & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Client Filter */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
                FILTRAR POR CLIENTE
              </label>
              <div className="relative">
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-body-lg text-sm text-on-surface cursor-pointer"
                >
                  <option value="all">Todos os Clientes ({clients.length})</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({formatEuro(c.rate)}/h)
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Period Filter */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-xs text-on-surface-variant block font-semibold">
                PERÍODO DE FECHO
              </label>
              <div className="relative">
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as PeriodFilterType)}
                  className="w-full h-11 px-3.5 pr-10 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none font-body-lg text-sm text-on-surface cursor-pointer"
                >
                  <option value="current_month">Mês Atual</option>
                  <option value="last_month">Mês Anterior</option>
                  <option value="first_half">1ª Quinzena (1 a 15)</option>
                  <option value="second_half">2ª Quinzena (16 ao fim)</option>
                  <option value="custom">Período Personalizado</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Custom Date Pickers if selected */}
          {periodType === 'custom' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-bright text-xs text-on-surface"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-on-surface-variant">
                  Data Final
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface-bright text-xs text-on-surface"
                />
              </div>
            </div>
          )}

          {/* Period Summary Metric Banner (Tema Claro & Destacado) */}
          <div className="bg-gradient-to-br from-primary/[0.04] via-surface-container-lowest to-surface-container-low/60 text-on-surface p-4 sm:p-5 rounded-2xl shadow-xs border border-primary/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  receipt_long
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface font-label-caps">
                  {periodLabel}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {filteredLogs.length} registos
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps">Total de Horas</p>
                <p className="font-code text-lg sm:text-xl font-bold text-on-surface">
                  {totalHours.toFixed(1)}h
                </p>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps">Valor Acordado</p>
                <p className="font-code text-lg sm:text-xl font-bold text-primary">
                  {formatEuro(averageRate)}/h
                </p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-amber-900 font-label-caps">Total a Faturar</p>
                <p className="font-code text-lg sm:text-xl font-bold text-amber-700">
                  {formatEuro(totalGross)}
                </p>
              </div>

              <div className="bg-emerald-50/80 p-3 rounded-xl border-2 border-emerald-400/80 shadow-xs">
                <p className="text-[10px] uppercase font-bold text-emerald-900 font-label-caps">Líquido Estimado</p>
                <p className="font-code text-lg sm:text-xl font-bold text-emerald-700">
                  {formatEuro(netEstimate.netEstimated)}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-on-surface-variant italic pt-0.5">
              IRS ({retentionTaxRate}%): -{formatEuro(netEstimate.retentionIrs)} · Seg. Social: -{formatEuro(netEstimate.socialSecurityEstimate)}
            </p>
          </div>

          {/* Work logs table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">
                Detalhamento dos Registos ({filteredLogs.length})
              </h3>
            </div>

            <div className="border border-outline-variant/30 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant/70 text-xs">
                  <span className="material-symbols-outlined text-[32px] text-outline mb-1 block">
                    event_busy
                  </span>
                  Nenhum registo encontrado para os filtros selecionados.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-high text-on-surface-variant font-semibold sticky top-0 border-b border-outline-variant/20">
                    <tr>
                      <th className="p-2.5 pl-3">Data</th>
                      <th className="p-2.5">Horário</th>
                      <th className="p-2.5">Pausa</th>
                      <th className="p-2.5">Horas</th>
                      <th className="p-2.5 text-right pr-3">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-2.5 pl-3 font-medium text-on-surface">{log.date}</td>
                        <td className="p-2.5 text-on-surface-variant">
                          {log.startTime} - {log.endTime}
                        </td>
                        <td className="p-2.5 text-on-surface-variant">
                          {log.pauseMinutes ? `${log.pauseMinutes}m` : '0m'}
                        </td>
                        <td className="p-2.5 font-code font-bold text-primary">
                          {log.totalHours.toFixed(1)}h
                        </td>
                        <td className="p-2.5 text-right pr-3 font-code font-bold text-on-surface">
                          {formatEuro(log.totalEarnings)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* WhatsApp Preview Card */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Mensagem Formatada para WhatsApp
              </span>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Abrir App</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
            <pre className="text-xs font-sans whitespace-pre-wrap text-emerald-900 dark:text-emerald-200 bg-white dark:bg-emerald-950/60 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50">
              {whatsAppMessage}
            </pre>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {/* WhatsApp 1-Click Copy */}
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className={`w-full sm:flex-1 h-12 rounded-xl font-headline-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              copiedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {copiedSuccess ? 'done_all' : 'content_copy'}
            </span>
            <span>
              {copiedSuccess ? 'Copiado para o WhatsApp!' : 'Copiar para WhatsApp'}
            </span>
          </button>

          {/* Export PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={pdfGenerating}
            className="w-full sm:flex-1 h-12 rounded-xl font-headline-lg text-sm font-semibold flex items-center justify-center gap-2 bg-primary text-on-primary hover:brightness-110 active:scale-95 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {pdfGenerating ? 'hourglass_top' : 'picture_as_pdf'}
            </span>
            <span>{pdfGenerating ? 'A gerar PDF...' : 'Exportar PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
