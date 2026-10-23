import { supabase, isSupabaseConfigured } from './supabase';
import { Client, WorkLog, Expense, UserProfile } from '../types';

/**
 * Mapeamentos entre CamelCase (Frontend) e SnakeCase (PostgreSQL / Supabase)
 */

export const mapProfileFromDb = (data: any, fallback: UserProfile): UserProfile => {
  if (!data) return fallback;
  return {
    ...fallback,
    name: data.name || fallback.name,
    email: data.email || fallback.email,
    avatarUrl: data.avatar_url || fallback.avatarUrl,
    monthlyGoal: Number(data.monthly_goal) || fallback.monthlyGoal,
    currency: data.currency || fallback.currency,
    taxRegime: data.tax_regime || fallback.taxRegime,
    annualRevenue: Number(data.annual_revenue) || fallback.annualRevenue,
    isPro: Boolean(data.is_pro),
    proDaysRemaining: data.pro_days_remaining ?? fallback.proDaysRemaining,
  };
};

export const mapClientFromDb = (row: any): Client => ({
  id: row.id,
  name: row.name,
  rate: Number(row.rate) || 0,
  retentionRate: row.retention_rate !== undefined && row.retention_rate !== null ? Number(row.retention_rate) : 25,
  totalBilled: Number(row.total_billed) || 0,
  pendingAmount: Number(row.pending_amount) || 0,
  pendingHours: Number(row.pending_hours) || 0,
  status: row.status || 'active',
  iconType: row.icon_type || 'briefcase',
  logoUrl: row.logo_url || undefined,
  email: row.email || undefined,
  phone: row.phone || undefined,
  notes: row.notes || undefined,
});

export const mapWorkLogFromDb = (row: any): WorkLog => ({
  id: row.id,
  date: row.date,
  startTime: row.start_time,
  endTime: row.end_time,
  pauseMinutes: Number(row.pause_minutes) || 0,
  clientId: row.client_id || '',
  clientName: row.client_name,
  hourlyRate: Number(row.hourly_rate) || 0,
  retentionRate: row.retention_rate !== undefined && row.retention_rate !== null ? Number(row.retention_rate) : 25,
  totalHours: Number(row.total_hours) || 0,
  totalEarnings: Number(row.total_earnings) || 0,
  description: row.description || '',
  status: row.status || 'pending',
  createdAt: row.created_at,
});

export const mapExpenseFromDb = (row: any): Expense => ({
  id: row.id,
  title: row.title,
  category: row.category || 'tools',
  amount: Number(row.amount) || 0,
  date: row.date,
});

/**
 * Funções de Carregamento Inicial do Usuário
 */
export async function loadUserDataFromSupabase(userId: string, defaultUser: UserProfile) {
  if (!isSupabaseConfigured || !userId) return null;

  try {
    const [profileRes, clientsRes, logsRes, expensesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('clients').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('work_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false }),
    ]);

    let userProfile = defaultUser;
    if (profileRes.data) {
      userProfile = mapProfileFromDb(profileRes.data, defaultUser);
    } else {
      // Se não existe na tabela profiles, cria o registro inicial
      await dbUpsertProfile(userId, defaultUser);
    }

    const clients: Client[] = (clientsRes.data || []).map(mapClientFromDb);
    const workLogs: WorkLog[] = (logsRes.data || []).map(mapWorkLogFromDb);
    const expenses: Expense[] = (expensesRes.data || []).map(mapExpenseFromDb);

    return {
      user: userProfile,
      clients,
      workLogs,
      expenses,
    };
  } catch (error) {
    console.error('[Supabase DB] Erro ao carregar dados do usuário:', error);
    return null;
  }
}

/**
 * Atualizar Perfil de Usuário
 */
export async function dbUpsertProfile(userId: string, profile: Partial<UserProfile>) {
  if (!isSupabaseConfigured || !userId) return;

  const payload: any = {
    id: userId,
    updated_at: new Date().toISOString(),
  };

  if (profile.name !== undefined) payload.name = profile.name;
  if (profile.email !== undefined) payload.email = profile.email;
  if (profile.avatarUrl !== undefined) payload.avatar_url = profile.avatarUrl;
  if (profile.monthlyGoal !== undefined) payload.monthly_goal = profile.monthlyGoal;
  if (profile.currency !== undefined) payload.currency = profile.currency;
  if (profile.taxRegime !== undefined) payload.tax_regime = profile.taxRegime;
  if (profile.annualRevenue !== undefined) payload.annual_revenue = profile.annualRevenue;
  if (profile.isPro !== undefined) payload.is_pro = profile.isPro;
  if (profile.proDaysRemaining !== undefined) payload.pro_days_remaining = profile.proDaysRemaining;

  try {
    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
    if (error) console.error('[Supabase DB] Erro ao salvar perfil:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao atualizar perfil:', err);
  }
}

/**
 * Operações com Clientes
 */
export async function dbAddClient(userId: string, client: Client) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    const { error } = await supabase.from('clients').insert({
      id: client.id,
      user_id: userId,
      name: client.name,
      rate: client.rate,
      total_billed: client.totalBilled,
      pending_amount: client.pendingAmount,
      pending_hours: client.pendingHours || 0,
      retention_rate: client.retentionRate ?? 25,
      status: client.status,
      icon_type: client.iconType,
      logo_url: client.logoUrl || null,
      email: client.email || null,
      phone: client.phone || null,
      notes: client.notes || null,
    });
    if (error) console.error('[Supabase DB] Erro ao adicionar cliente:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao adicionar cliente:', err);
  }
}

export async function dbUpdateClient(clientId: string, updates: Partial<Client>) {
  if (!isSupabaseConfigured || !clientId) return;
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.rate !== undefined) payload.rate = updates.rate;
    if (updates.retentionRate !== undefined) payload.retention_rate = updates.retentionRate;
    if (updates.totalBilled !== undefined) payload.total_billed = updates.totalBilled;
    if (updates.pendingAmount !== undefined) payload.pending_amount = updates.pendingAmount;
    if (updates.pendingHours !== undefined) payload.pending_hours = updates.pendingHours;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.iconType !== undefined) payload.icon_type = updates.iconType;
    if (updates.logoUrl !== undefined) payload.logo_url = updates.logoUrl;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.notes !== undefined) payload.notes = updates.notes;

    const { error } = await supabase.from('clients').update(payload).eq('id', clientId);
    if (error) console.error('[Supabase DB] Erro ao atualizar cliente:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao atualizar cliente:', err);
  }
}

export async function dbDeleteClient(clientId: string) {
  if (!isSupabaseConfigured || !clientId) return;
  try {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) console.error('[Supabase DB] Erro ao apagar cliente:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao apagar cliente:', err);
  }
}

/**
 * Operações com Registros de Horas (Work Logs)
 */
export async function dbAddWorkLog(userId: string, log: WorkLog) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    const { error } = await supabase.from('work_logs').insert({
      id: log.id,
      user_id: userId,
      client_id: log.clientId || null,
      client_name: log.clientName,
      hourly_rate: log.hourlyRate,
      retention_rate: log.retentionRate ?? 25,
      total_hours: log.totalHours,
      total_earnings: log.totalEarnings,
      pause_minutes: log.pauseMinutes ?? 0,
      description: log.description,
      date: log.date,
      start_time: log.startTime,
      end_time: log.endTime,
      status: log.status,
    });
    if (error) console.error('[Supabase DB] Erro ao adicionar registro de trabalho:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao adicionar registro de trabalho:', err);
  }
}

export async function dbUpdateWorkLogStatus(logId: string, status: 'paid' | 'pending') {
  if (!isSupabaseConfigured || !logId) return;
  try {
    const { error } = await supabase.from('work_logs').update({ status }).eq('id', logId);
    if (error) console.error('[Supabase DB] Erro ao alterar status do trabalho:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao alterar status do trabalho:', err);
  }
}

export async function dbDeleteWorkLog(logId: string) {
  if (!isSupabaseConfigured || !logId) return;
  try {
    const { error } = await supabase.from('work_logs').delete().eq('id', logId);
    if (error) console.error('[Supabase DB] Erro ao apagar registro de trabalho:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao apagar registro de trabalho:', err);
  }
}

/**
 * Operações com Despesas
 */
export async function dbAddExpense(userId: string, expense: Expense) {
  if (!isSupabaseConfigured || !userId) return;
  try {
    const { error } = await supabase.from('expenses').insert({
      id: expense.id,
      user_id: userId,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });
    if (error) console.error('[Supabase DB] Erro ao adicionar despesa:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao adicionar despesa:', err);
  }
}

export async function dbDeleteExpense(expenseId: string) {
  if (!isSupabaseConfigured || !expenseId) return;
  try {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
    if (error) console.error('[Supabase DB] Erro ao apagar despesa:', error);
  } catch (err) {
    console.error('[Supabase DB] Exceção ao apagar despesa:', err);
  }
}
