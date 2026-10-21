import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, WorkLog, Expense, UserProfile, Currency, ChatMessage } from '../types';
import {
  INITIAL_USER,
  INITIAL_CLIENTS,
  INITIAL_WORK_LOGS,
  INITIAL_EXPENSES,
  INITIAL_CHAT_MESSAGES,
} from '../data/initialData';

export type ScreenType =
  | 'home'
  | 'time'
  | 'clients'
  | 'finances'
  | 'tax'
  | 'ai'
  | 'onboarding'
  | 'auth'
  | 'settings';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
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
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

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

  // Sync with localStorage
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

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addClient = (newClient: Omit<Client, 'id'>) => {
    const client: Client = {
      ...newClient,
      id: `client_${Date.now()}`,
    };
    setClients((prev) => [client, ...prev]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const addWorkLog = (logData: Omit<WorkLog, 'id' | 'createdAt'>) => {
    const newLog: WorkLog = {
      ...logData,
      id: `log_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWorkLogs((prev) => [newLog, ...prev]);

    // Also update client pending amount and billed totals
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === logData.clientId) {
          return {
            ...c,
            totalBilled: c.totalBilled + (logData.status === 'paid' ? logData.totalEarnings : 0),
            pendingAmount: c.pendingAmount + (logData.status === 'pending' ? logData.totalEarnings : 0),
            pendingHours: (c.pendingHours || 0) + (logData.status === 'pending' ? logData.totalHours : 0),
          };
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
            return {
              ...c,
              totalBilled: Math.max(0, c.totalBilled - (target.status === 'paid' ? target.totalEarnings : 0)),
              pendingAmount: Math.max(0, c.pendingAmount - (target.status === 'pending' ? target.totalEarnings : 0)),
              pendingHours: Math.max(0, (c.pendingHours || 0) - (target.status === 'pending' ? target.totalHours : 0)),
            };
          }
          return c;
        })
      );
    }
    setWorkLogs((prev) => prev.filter((w) => w.id !== id));
  };

  const markLogStatus = (id: string, status: 'paid' | 'pending') => {
    const target = workLogs.find((w) => w.id === id);
    if (target && target.status !== status) {
      setClients((prevClients) =>
        prevClients.map((c) => {
          if (c.id === target.clientId) {
            const diffEarnings = target.totalEarnings;
            const diffHours = target.totalHours;
            if (status === 'paid') {
              return {
                ...c,
                totalBilled: c.totalBilled + diffEarnings,
                pendingAmount: Math.max(0, c.pendingAmount - diffEarnings),
                pendingHours: Math.max(0, (c.pendingHours || 0) - diffHours),
              };
            } else {
              return {
                ...c,
                totalBilled: Math.max(0, c.totalBilled - diffEarnings),
                pendingAmount: c.pendingAmount + diffEarnings,
                pendingHours: (c.pendingHours || 0) + diffHours,
              };
            }
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
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
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

  // Computations
  const totalHoursThisMonth = workLogs.reduce((acc, curr) => acc + curr.totalHours, 0);
  const totalReceived = workLogs
    .filter((w) => w.status === 'paid')
    .reduce((acc, curr) => acc + curr.totalEarnings, 0);
  const totalPending = workLogs
    .filter((w) => w.status === 'pending')
    .reduce((acc, curr) => acc + curr.totalEarnings, 0);
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
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        user,
        updateUser,
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
