import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const AiAssistantScreen: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    setCurrentScreen,
    stats,
    clients,
    workLogs,
    formatCurrency,
    user,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addChatMessage({
      sender: 'user',
      text: text.trim(),
      timestamp: 'AGORA',
    });

    setInputVal('');
    setIsTyping(true);

    // Generate intelligent data-driven response
    setTimeout(() => {
      let replyText = '';
      let dataCard: ChatMessage['dataCard'] = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('faturei') || lower.includes('ganho') || lower.includes('recebido')) {
        replyText = `Neste mês, você já faturou um total de ${formatCurrency(
          stats.totalReceived
        )} em faturas liquidadas, com mais ${formatCurrency(
          stats.totalPending
        )} pendentes de recebimento.`;
        dataCard = {
          type: 'financial_summary',
          items: [
            { label: 'RECEBIDO', value: formatCurrency(stats.totalReceived), color: '#630ed4' },
            { label: 'PENDENTE', value: formatCurrency(stats.totalPending), color: '#ba1a1a' },
          ],
          footerNote: `Meta do mês: ${stats.goalPercentage}% atingida (${formatCurrency(
            stats.monthlyGoal
          )}).`,
        };
      } else if (lower.includes('melhor cliente') || lower.includes('maior cliente')) {
        const topClient = [...clients].sort((a, b) => b.totalBilled - a.totalBilled)[0] || clients[0];
        replyText = `O seu maior cliente em volume histórico é o ${topClient.name}, com ${formatCurrency(
          topClient.totalBilled
        )} faturados a uma taxa de ${formatCurrency(topClient.rate)}/h.`;
        dataCard = {
          type: 'financial_summary',
          items: [
            { label: 'CLIENTE', value: topClient.name, color: '#630ed4' },
            { label: 'TOTAL FATURADO', value: formatCurrency(topClient.totalBilled), color: '#0051d5' },
          ],
          footerNote: 'Representa a maior parcela do seu faturamento anual.',
        };
      } else if (lower.includes('cobrar') || lower.includes('hora') || lower.includes('taxa')) {
        const avgRate = Math.round(clients.reduce((acc, c) => acc + c.rate, 0) / (clients.length || 1));
        replyText = `A sua taxa horária média atual é de ${formatCurrency(
          avgRate
        )}/h. Com base na sua meta mensal de ${formatCurrency(
          stats.monthlyGoal
        )} e numa jornada média de 120 horas mensais, recomendamos praticar entre ${formatCurrency(
          Math.round(stats.monthlyGoal / 100)
        )}/h e ${formatCurrency(Math.round(stats.monthlyGoal / 70))}/h para novos projetos.`;
        dataCard = {
          type: 'tax_info',
          items: [
            { label: 'TAXA ATUAL', value: `${formatCurrency(avgRate)}/h`, color: '#630ed4' },
            { label: 'SUGESTÃO', value: `${formatCurrency(Math.round(avgRate * 1.25))}/h`, color: '#16a34a' },
          ],
          footerNote: 'Ajuste anual sugerido: +20% a +25% para cobrir inflação e impostos.',
        };
      } else if (lower.includes('resumo') || lower.includes('última semana') || lower.includes('horas')) {
        replyText = `Na última semana, você registrou um total de ${stats.totalHoursThisMonth} horas. Aqui está o detalhamento estimado por projeto:`;
        dataCard = {
          type: 'hours_breakdown',
          items: [
            { label: 'DESIGN SYSTEM', value: '22h', color: '#630ed4' },
            { label: 'API DEV', value: '16h', color: '#0051d5' },
          ],
          footerNote: `Seu faturamento estimado para estas horas é de ${formatCurrency(stats.totalReceived + 780)}.`,
        };
      } else if (lower.includes('imposto') || lower.includes('irs') || lower.includes('segurança social')) {
        replyText = `Para uma faturação anual de € 45.000 no Regime Simplificado em Portugal, o seu lucro líquido estimado é de cerca de 63% (€ 28.450/ano), com retenção de IRS e contribuições para a Segurança Social.`;
        dataCard = {
          type: 'tax_info',
          items: [
            { label: 'LUCRO LÍQUIDO', value: '63%', color: '#630ed4' },
            { label: 'RETENÇÃO + SS', value: '37%', color: '#d97706' },
          ],
          footerNote: 'Aceda à Calculadora de Impostos no menu Relatórios para simular outros valores.',
        };
      } else {
        replyText = `Com base nas suas 120 horas trabalhadas e nas faturas ativas, o seu ritmo de faturamento está excelente. O que mais gostaria de analisar sobre seus clientes ou metas?`;
      }

      addChatMessage({
        sender: 'ai',
        text: replyText,
        timestamp: 'AGORA',
        dataCard,
      });

      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-16 pb-32">
      {/* Sub Header for AI Assistant */}
      <div className="bg-surface/80 backdrop-blur-md px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between max-w-3xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-1.5 -ml-1 text-primary hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-xs">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
          </div>
          <div>
            <h2 className="font-headline-lg-mobile text-sm md:text-base font-bold text-primary">
              Tempo & Ganho AI
            </h2>
            <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Online e conectado aos seus dados
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('tax')}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Simulador Fiscal
        </button>
      </div>

      {/* Chat Messages Body */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-6 space-y-5 overflow-y-auto">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-primary'
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: msg.sender === 'user' ? "'FILL' 1" : "'FILL' 0" }}
              >
                {msg.sender === 'user' ? 'person' : 'auto_awesome'}
              </span>
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-on-primary rounded-tr-none'
                    : 'bg-surface-container-lowest border border-outline-variant/40 rounded-tl-none text-on-surface'
                }`}
              >
                <p>{msg.text}</p>

                {/* Optional Bento Insight Card inside Chat */}
                {msg.dataCard && (
                  <div className="mt-3.5 space-y-2 text-left">
                    <div className="grid grid-cols-2 gap-2">
                      {msg.dataCard.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/30"
                        >
                          <span className="font-label-caps text-[10px] text-on-surface-variant font-bold block">
                            {item.label}
                          </span>
                          <p
                            className="font-title-md text-base font-bold font-code mt-0.5"
                            style={{ color: item.color || '#630ed4' }}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    {msg.dataCard.footerNote && (
                      <p className="text-xs text-on-surface-variant italic pt-1 border-t border-outline-variant/20">
                        {msg.dataCard.footerNote}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <span className="font-label-caps text-[10px] text-on-surface-variant/70 mt-1 px-1 block uppercase font-semibold">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-1">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl rounded-tl-none p-4 shadow-xs">
              <div className="flex gap-1.5 items-center h-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        {/* Suggested Quick Prompts */}
        <div className="pt-2 pb-2">
          <p className="text-xs text-on-surface-variant font-medium mb-2">Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Quanto faturei este mês?',
              'Qual o meu melhor cliente?',
              'Quanto devo cobrar por hora?',
              'Mostre um resumo das minhas horas trabalhadas na última semana.',
              'Como funcionam os impostos em Portugal?',
            ].map((promptText) => (
              <button
                key={promptText}
                onClick={() => handleSendPrompt(promptText)}
                className="px-3.5 py-1.5 bg-white border border-outline-variant/50 rounded-full font-body-sm text-xs font-semibold text-primary hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-xs cursor-pointer text-left"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        <div ref={chatBottomRef} />
      </main>

      {/* Floating Bottom Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl pt-3 pb-6 md:pb-8 z-40 border-t border-outline-variant/30">
        <div className="max-w-3xl mx-auto px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputVal);
            }}
            className="relative"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Pergunte qualquer coisa..."
              className="w-full bg-white border border-outline-variant/60 rounded-3xl py-3.5 pl-5 pr-14 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-md font-body-lg text-sm text-on-surface outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-90 shadow-md cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            </button>
          </form>
          <p className="text-center mt-2 font-label-caps text-[10px] text-on-surface-variant/60">
            Tempo & Ganho AI pode apresentar informações imprecisas.
          </p>
        </div>
      </div>
    </div>
  );
};
