export type Currency = 'EUR' | 'BRL';

export interface Client {
  id: string;
  name: string;
  rate: number; // taxa horária padrão em €
  retentionRate?: number; // taxa de retenção na fonte padrão em % (ex: 0, 11.5, 16.5, 25)
  totalBilled: number;
  pendingAmount: number;
  status: 'active' | 'paused' | 'new';
  iconType: 'rocket' | 'palette' | 'finance' | 'health' | 'code' | 'briefcase';
  logoUrl?: string;
  pendingHours?: number;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface WorkLog {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  pauseMinutes?: number; // minutos de pausa (ex: almoço, descanso)
  clientId: string;
  clientName: string;
  hourlyRate: number;
  retentionRate?: number; // retenção na fonte aplicada (%)
  totalHours: number;
  totalEarnings: number;
  description: string;
  status: 'paid' | 'pending';
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'fuel' | 'tools' | 'food' | 'office' | 'services';
  amount: number;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  monthlyGoal: number;
  isPro: boolean;
  proDaysRemaining: number;
  currency: Currency;
  taxRegime: 'services' | 'sales' | 'other';
  annualRevenue: number;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  dataCard?: {
    type: 'hours_breakdown' | 'financial_summary' | 'tax_info';
    items: { label: string; value: string; color?: string }[];
    footerNote?: string;
  };
}

export type PeriodType =
  | 'current_month'
  | 'previous_month'
  | 'first_fortnight'
  | 'second_fortnight'
  | 'custom';
