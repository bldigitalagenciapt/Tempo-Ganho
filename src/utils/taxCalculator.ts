import { WorkLog } from '../types';

/**
 * Utilitário de Cálculos Fiscais e Regras para Trabalhadores a Recibos Verdes em Portugal
 */

export const VAT_EXEMPTION_LIMIT_ART53 = 15000; // Teto de isenção de IVA (Art. 53.º do CIVA)
export const VAT_WARNING_THRESHOLD_PERCENT = 80; // Alerta aos 80% (€12.000)
export const SS_RELEVANT_INCOME_COEFFICIENT = 0.70; // 70% do valor da prestação de serviços
export const SS_DEFAULT_TAX_RATE = 0.214; // Alíquota padrão de 21,4% para recibos verdes

export const SS_DISCLAIMER =
  'Cálculo indicativo com base na regra geral de 70% do rendimento relevante.';

/**
 * Formata valores no padrão europeu em Euros (€)
 * Exemplo: 1250.5 -> "1 250,50 €"
 */
export function formatEuro(amount: number): string {
  const formatted = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

  return formatted;
}

/**
 * Calcula a Retenção na Fonte de IRS
 * @param grossAmount Valor bruto faturado
 * @param retentionRate Taxa percentual configurada (0%, 11.5%, 16.5%, 25% ou custom)
 */
export function calculateIrsRetention(grossAmount: number, retentionRate: number = 25): number {
  if (!grossAmount || grossAmount <= 0) return 0;
  if (!retentionRate || retentionRate <= 0) return 0;
  return Math.round(grossAmount * (retentionRate / 100) * 100) / 100;
}

/**
 * Previsão de Segurança Social (estimativa indicativa)
 * Regra geral recibos verdes: Base de incidência = 70% do rendimento. Taxa: 21,4%
 * Valor = (Total Bruto * 0.70) * 0.214
 */
export function calculateSocialSecurity(grossAmount: number): number {
  if (!grossAmount || grossAmount <= 0) return 0;
  const relevantIncome = grossAmount * SS_RELEVANT_INCOME_COEFFICIENT;
  return Math.round(relevantIncome * SS_DEFAULT_TAX_RATE * 100) / 100;
}

export interface NetEstimateResult {
  gross: number;
  retentionIrs: number;
  retentionRateUsed: number;
  socialSecurityEstimate: number;
  netEstimated: number;
  disclaimer: string;
}

/**
 * Decomposição completa de Valor Bruto, Impostos e Líquido Estimado Final
 */
export function calculateNetEstimate(
  grossAmount: number,
  retentionRate: number = 25
): NetEstimateResult {
  const gross = Math.max(0, grossAmount || 0);
  const retentionIrs = calculateIrsRetention(gross, retentionRate);
  const socialSecurityEstimate = calculateSocialSecurity(gross);
  const netEstimated = Math.max(0, gross - retentionIrs - socialSecurityEstimate);

  return {
    gross,
    retentionIrs,
    retentionRateUsed: retentionRate,
    socialSecurityEstimate,
    netEstimated,
    disclaimer: SS_DISCLAIMER,
  };
}

/**
 * Análise do Teto de Isenção do IVA (Art. 53.º do CIVA)
 * Limite em Portugal: 15.000 € / ano civil
 */
export interface IvaStatusResult {
  limit: number;
  currentRevenue: number;
  percentage: number;
  isWarning: boolean; // >= 80% (€12.000)
  isExceeded: boolean; // > €15.000
  remaining: number;
}

export function getIvaExemptionStatus(yearlyRevenue: number): IvaStatusResult {
  const current = Math.max(0, yearlyRevenue || 0);
  const limit = VAT_EXEMPTION_LIMIT_ART53;
  const percentage = Math.min(100, Math.round((current / limit) * 100));
  const isWarning = current >= limit * (VAT_WARNING_THRESHOLD_PERCENT / 100) && current <= limit;
  const isExceeded = current > limit;
  const remaining = Math.max(0, limit - current);

  return {
    limit,
    currentRevenue: current,
    percentage,
    isWarning,
    isExceeded,
    remaining,
  };
}

/**
 * Trimestres da Segurança Social Direta
 */
export interface QuarterInfo {
  quarter: 1 | 2 | 3 | 4;
  label: string; // Ex: "T1 (Jan - Mar)"
  months: number[]; // 0-indexed (0=Jan, 1=Fev, etc.)
  monthsLabel: string;
  submissionMonth: string; // Ex: "Entregue em Abril"
}

export const QUARTERS_INFO: QuarterInfo[] = [
  { quarter: 1, label: '1º Trimestre (T1)', months: [0, 1, 2], monthsLabel: 'Jan, Fev, Mar', submissionMonth: 'Entregar de 1 a 30 de Abril' },
  { quarter: 2, label: '2º Trimestre (T2)', months: [3, 4, 5], monthsLabel: 'Abr, Mai, Jun', submissionMonth: 'Entregar de 1 a 31 de Julho' },
  { quarter: 3, label: '3º Trimestre (T3)', months: [6, 7, 8], monthsLabel: 'Jul, Ago, Set', submissionMonth: 'Entregar de 1 a 31 de Outubro' },
  { quarter: 4, label: '4º Trimestre (T4)', months: [9, 10, 11], monthsLabel: 'Out, Nov, Dez', submissionMonth: 'Entregar de 1 a 31 de Janeiro' },
];

export interface QuarterlySummaryResult {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  quarterInfo: QuarterInfo;
  totalGrossRevenue: number;
  relevantIncome70: number; // 70% da prestação de serviços
  estimatedMonthlyPayment: number; // Contribuição mensal calculada para os 3 meses seguintes
  logsCount: number;
}

/**
 * Calcula a soma de faturamento e valores para a Declaração Trimestral da SS Direta
 */
export function getQuarterlyRevenue(
  workLogs: WorkLog[],
  year: number,
  quarter: 1 | 2 | 3 | 4
): QuarterlySummaryResult {
  const info = QUARTERS_INFO.find((q) => q.quarter === quarter) || QUARTERS_INFO[0];

  const filteredLogs = workLogs.filter((log) => {
    if (!log.date) return false;
    const [logYear, logMonth] = log.date.split('-').map(Number);
    return logYear === year && info.months.includes(logMonth - 1);
  });

  const totalGrossRevenue = filteredLogs.reduce((acc, curr) => acc + (curr.totalEarnings || 0), 0);
  const relevantIncome70 = totalGrossRevenue * SS_RELEVANT_INCOME_COEFFICIENT;
  const estimatedMonthlyPayment = Math.round(((relevantIncome70 / 3) * SS_DEFAULT_TAX_RATE) * 100) / 100;

  return {
    year,
    quarter,
    quarterInfo: info,
    totalGrossRevenue,
    relevantIncome70,
    estimatedMonthlyPayment,
    logsCount: filteredLogs.length,
  };
}

/**
 * Gera mensagem formatada pronta para o WhatsApp de fecho de período
 */
export function generateWhatsAppClosingText(params: {
  periodLabel: string;
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
  clientName?: string;
}): string {
  const { periodLabel, totalHours, hourlyRate, totalAmount, clientName } = params;

  return [
    `Olá${clientName ? ` ${clientName}` : ''}! Segue o resumo das horas trabalhadas referente a ${periodLabel}:`,
    ``,
    `• Total de horas: ${totalHours.toFixed(1)}h`,
    `• Valor acordado: ${formatEuro(hourlyRate)}/h`,
    `• Total a faturar: ${formatEuro(totalAmount)}`,
    ``,
    `Fico a aguardar a confirmação para emissão do recibo verde.`,
  ].join('\n');
}
