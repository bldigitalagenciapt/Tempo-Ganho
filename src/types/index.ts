export type Currency = 'EUR' | 'BRL';

export interface Client {
  id: string;
  name: string;
  rate: number; // hourly rate
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
  clientId: string;
  clientName: string;
  hourlyRate: number;
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
