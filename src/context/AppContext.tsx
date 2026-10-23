import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, WorkLog, Expense, UserProfile, Currency, ChatMessage } from '../types';
import {
  INITIAL_USER,
  INITIAL_CLIENTS,
  INITIAL_WORK_LOGS,
  INITIAL_EXPENSES,
  INITIAL_CHAT_MESSAGES,
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isStripeConfigured } from '../lib/stripe';
import {
  loadUserDataFromSupabase,
  dbUpsertProfile,
  dbAddClient,
  dbUpdateClient,
  dbDeleteClient,
  dbAddWorkLog,
  dbUpdateWorkLogStatus,
  dbDeleteWorkLog,
  dbAddExpense,
  dbDeleteExpense,
} from '../lib/db';

export type ScreenType =
  | 'landing'
  | 'home'
  | 'time'
  | 'clients'
  | 'finances'
  | 'tax'
  | 'ai'
  | 'onboarding'
  | 'auth'
  | 'settings';

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'local_demo';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  currentUserId: string | null;
  cloudSyncStatus: CloudSyncStatus;
  isSupabaseConfigured: boolean;
  isStripeConfigured: boolean;
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  workLogs: WorkLog[];
  addWorkLog: (log: Omit<WorkLog, 'id' | 'createdAt'>) => void;
  deleteWorkLog: (id: string) => void;
  markLogStatus: (id: string, status: 'paid' | 'pending') => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
  // Auth
  signOut: () => Promise<void>;
  // Modals & Sheets
  isNewWorkModalOpen: boolean;
  setIsNewWorkModalOpen: (open: boolean) => void;
  isNewClientModalOpen: boolean;
  setIsNewClientModalOpen: (open: boolean) => void;
  selectedClientForDetails: Client | null;
  setSelectedClientForDetails: (client: Client | null) => void;
  isNewExpenseModalOpen: boolean;
  setIsNewExpenseModalOpen: (open: boolean) => void;
  isProModalOpen: boolean;
  setIsProModalOpen: (open: boolean) => void;
  isCalendarModalOpen: boolean;
  setIsCalendarModalOpen: (open: boolean) => void;
  isPeriodClosingModalOpen: boolean;
  setIsPeriodClosingModalOpen: (open: boolean) => void;
  // Computed helpers
  stats: {
    totalHoursThisMonth: number;
    hoursGrowthVsLastMonth: number;
    totalReceived: number;
    totalPending: number;
    pendingCount: number;
    monthlyGoal: number;
    goalPercentage: number;
    totalExpenses: number;
    netProfit: number;
    estimatedMonthEnd: number;
    totalGrossBilled: number;
    totalIrsRetention: number;
    totalSocialSecurity: number;
    estimatedNetRevenue: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page === 'landing') return 'landing';
      if (page === 'app' || page === 'home') return 'home';
      const hasEnteredApp = localStorage.getItem('tempo_ganho_entered_app');
      if (!hasEnteredApp) return 'landing';
    }
    return 'home';
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>(
    isSupabaseConfigured ? 'syncing' : 'local_demo'
  );

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tempo_ganho_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('tempo_ganho_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => {
    const saved = localStorage.getItem('tempo_ganho_work_logs');
    return saved ? JSON.parse(saved) : INITIAL_WORK_LOGS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('tempo_ganho_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tempo_ganho_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Modal states
  const [isNewWorkModalOpen, setIsNewWorkModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isPeriodClosingModalOpen, setIsPeriodClosingModalOpen] = useState(false);

  // Sync with localStorage as cache / fallback
  useEffect(() => {
    localStorage.setItem('tempo_ganho_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tempo_ganho_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('tempo_ganho_work_logs', JSON.stringify(workLogs));
  }, [workLogs]);

  useEffect(() => {
    localStorage.setItem('tempo_ganho_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('tempo_ganho_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Função interna para carregar dados da nuvem Supabase quando autenticado
  const syncWithSupabaseUser = async (userId: string, email?: string, name?: string) => {
    setCurrentUserId(userId);
    setCloudSyncStatus('syncing');

    try {
      const dbData = await loadUserDataFromSupabase(userId, {
        ...user,
        email: email || user.email,
        name: name || user.name,
      });

      if (dbData) {
        setUser(dbData.user);
        if (dbData.clients && dbData.clients.length > 0) setClients(dbData.clients);
        if (dbData.workLogs && dbData.workLogs.length > 0) setWorkLogs(dbData.workLogs);
        if (dbData.expenses && dbData.expenses.length > 0) setExpenses(dbData.expenses);
        setCloudSyncStatus('synced');
      } else {
        setCloudSyncStatus('synced');
      }
    } catch (err) {
      console.error('[Supabase Sync Error]', err);
      setCloudSyncStatus('offline');
    }
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCloudSyncStatus('local_demo');
      return;
    }

    // Checar sessão ativa na inicialização
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncWithSupabaseUser(
          session.user.id,
          session.user.email,
          session.user.user_metadata?.full_name || session.user.user_metadata?.name
        );
      } else {
        setCloudSyncStatus('local_demo');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        syncWithSupabaseUser(
          session.user.id,
          session.user.email,
          session.user.user_metadata?.full_name || session.user.user_metadata?.name
        );
      } else {
        setCurrentUserId(null);
        setCloudSyncStatus('local_demo');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUserId(null);
    setCloudSyncStatus(isSupabaseConfigured ? 'offline' : 'local_demo');
    localStorage.removeItem('tempo_ganho_user');
    setUser(INITIAL_USER);
    setCurrentScreen('auth');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      if (isSupabaseConfigured && currentUserId) {
        dbUpsertProfile(currentUserId, next);
      }
      return next;
    });
  };

  const addClient = (newClient: Omit<Client, 'id'>) => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `client_${Date.now()}`;

    const client: Client = {
      ...newClient,
      id: newId,
    };

    setClients((prev) => [client, ...prev]);

    if (isSupabaseConfigured && currentUserId) {
      dbAddClient(currentUserId, client);
    }
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (isSupabaseConfigured && currentUserId) {
      dbUpdateClient(id, updates);
    }
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured && currentUserId) {
      dbDeleteClient(id);
    }
  };

  const addWorkLog = (logData: Omit<WorkLog, 'id' | 'createdAt'>) => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `log_${Date.now()}`;

    const newLog: WorkLog = {
      ...logData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setWorkLogs((prev) => [newLog, ...prev]);

    if (isSupabaseConfigured && currentUserId) {
      dbAddWorkLog(currentUserId, newLog);
    }

    // Atualiza totais faturados e pendentes no cliente
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === logData.clientId) {
          const updated = {
            ...c,
            totalBilled: c.totalBilled + (logData.status === 'paid' ? logData.totalEarnings : 0),
            pendingAmount: c.pendingAmount + (logData.status === 'pending' ? logData.totalEarnings : 0),
            pendingHours: (c.pendingHours || 0) + (logData.status === 'pending' ? logData.totalHours : 0),
          };
          if (isSupabaseConfigured && currentUserId) {
            dbUpdateClient(c.id, {
              totalBilled: updated.totalBilled,
              pendingAmount: updated.pendingAmount,
              pendingHours: updated.pendingHours,
            });
          }
          return updated;
        }
        return c;
      })
    );
  };

  const deleteWorkLog = (id: string) => {
    const target = workLogs.find((w) => w.id === id);
    if (target) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === target.clientId) {
            const updated = {
              ...c,
              totalBilled: Math.max(0, c.totalBilled - (target.status === 'paid' ? target.totalEarnings : 0)),
              pendingAmount: Math.max(0, c.pendingAmount - (target.status === 'pending' ? target.totalEarnings : 0)),
              pendingHours: Math.max(0, (c.pendingHours || 0) - (target.status === 'pending' ? target.totalHours : 0)),
            };
            if (isSupabaseConfigured && currentUserId) {
              dbUpdateClient(c.id, {
                totalBilled: updated.totalBilled,
                pendingAmount: updated.pendingAmount,
                pendingHours: updated.pendingHours,
              });
            }
            return updated;
          }
          return c;
        })
      );
    }
    setWorkLogs((prev) => prev.filter((w) => w.id !== id));
    if (isSupabaseConfigured && currentUserId) {
      dbDeleteWorkLog(id);
    }
  };

  const markLogStatus = (id: string, status: 'paid' | 'pending') => {
    const target = workLogs.find((w) => w.id === id);
    if (target && target.status !== status) {
      setClients((prevClients) =>
        prevClients.map((c) => {
          if (c.id === target.clientId) {
            const diffEarnings = target.totalEarnings;
            const diffHours = target.totalHours;
            const updated =
              status === 'paid'
                ? {
                    ...c,
                    totalBilled: c.totalBilled + diffEarnings,
                    pendingAmount: Math.max(0, c.pendingAmount - diffEarnings),
                    pendingHours: Math.max(0, (c.pendingHours || 0) - diffHours),
                  }
                : {
                    ...c,
                    totalBilled: Math.max(0, c.totalBilled - diffEarnings),
                    pendingAmount: c.pendingAmount + diffEarnings,
                    pendingHours: (c.pendingHours || 0) + diffHours,
                  };

            if (isSupabaseConfigured && currentUserId) {
              dbUpdateClient(c.id, {
                totalBilled: updated.totalBilled,
                pendingAmount: updated.pendingAmount,
                pendingHours: updated.pendingHours,
              });
            }
            return updated;
          }
          return c;
        })
      );
    }

    setWorkLogs((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, status };
        }
        return w;
      })
    );

    if (isSupabaseConfigured && currentUserId) {
      dbUpdateWorkLogStatus(id, status);
    }
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `exp_${Date.now()}`;

    const newExpense: Expense = {
      ...expenseData,
      id: newId,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    if (isSupabaseConfigured && currentUserId) {
      dbAddExpense(currentUserId, newExpense);
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (isSupabaseConfigured && currentUserId) {
      dbDeleteExpense(id);
    }
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const currencySymbol = user.currency === 'BRL' ? 'R$' : '€';

  const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat('pt-PT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${currencySymbol}${formatted}`;
  };

  // Cálculos financeiros
  const totalHoursThisMonth = workLogs.reduce((acc, curr) => acc + curr.totalHours, 0);
  const totalReceived = workLogs
    .filter((w) => w.status === 'paid')
    .reduce((acc, curr) => acc + curr.totalEarnings, 0);
  const totalPending = workLogs
    .filter((w) => w.status === 'pending')
    .reduce((acc, curr) => acc + curr.totalEarnings, 0);
  const totalGrossBilled = workLogs.reduce((acc, curr) => acc + curr.totalEarnings, 0);

  // Retenção na fonte por log ou cliente padrão (25%)
  const totalIrsRetention = workLogs.reduce((acc, curr) => {
    const rate = curr.retentionRate ?? (clients.find((c) => c.id === curr.clientId)?.retentionRate ?? 25);
    return acc + Math.round(curr.totalEarnings * (rate / 100) * 100) / 100;
  }, 0);

  // Previsão SS: 70% da prestação de serviços tributada a 21.4%
  const totalSocialSecurity = Math.round((totalGrossBilled * 0.70) * 0.214 * 100) / 100;
  const estimatedNetRevenue = Math.max(0, totalGrossBilled - totalIrsRetention - totalSocialSecurity);

  const pendingCount = workLogs.filter((w) => w.status === 'pending').length;
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalReceived - totalExpenses;
  const goalPercentage = user.monthlyGoal > 0 ? Math.min(100, Math.round((totalReceived / user.monthlyGoal) * 100)) : 0;
  const estimatedMonthEnd = Math.round(totalReceived + (totalPending * 0.75));

  const stats = {
    totalHoursThisMonth,
    hoursGrowthVsLastMonth: 12,
    totalReceived,
    totalPending,
    pendingCount,
    monthlyGoal: user.monthlyGoal,
    goalPercentage,
    totalExpenses,
    netProfit,
    estimatedMonthEnd,
    totalGrossBilled,
    totalIrsRetention,
    totalSocialSecurity,
    estimatedNetRevenue,
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        user,
        updateUser,
        currentUserId,
        cloudSyncStatus,
        isSupabaseConfigured,
        isStripeConfigured,
        clients,
        addClient,
        updateClient,
        deleteClient,
        workLogs,
        addWorkLog,
        deleteWorkLog,
        markLogStatus,
        expenses,
        addExpense,
        deleteExpense,
        chatMessages,
        addChatMessage,
        formatCurrency,
        currencySymbol,
        signOut,
        isNewWorkModalOpen,
        setIsNewWorkModalOpen,
        isNewClientModalOpen,
        setIsNewClientModalOpen,
        selectedClientForDetails,
        setSelectedClientForDetails,
        isNewExpenseModalOpen,
        setIsNewExpenseModalOpen,
        isProModalOpen,
        setIsProModalOpen,
        isCalendarModalOpen,
        setIsCalendarModalOpen,
        isPeriodClosingModalOpen,
        setIsPeriodClosingModalOpen,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
