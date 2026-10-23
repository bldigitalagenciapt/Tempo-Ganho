-- ==============================================================================
-- SCHEMA SUPABASE - TEMPO & GANHO SAAS
-- Execute este script no SQL Editor do Supabase (https://supabase.com/dashboard)
-- Projeto > SQL Editor > New query > Cole e clique em RUN
-- ==============================================================================

-- 1. Habilitar extensões necessárias (se ainda não estiverem ativas)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Perfis de Usuário (vinculada à auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Utilizador',
  avatar_url TEXT,
  monthly_goal NUMERIC(10, 2) NOT NULL DEFAULT 3650.00,
  currency TEXT NOT NULL DEFAULT 'EUR',
  tax_regime TEXT NOT NULL DEFAULT 'services',
  annual_revenue NUMERIC(12, 2) NOT NULL DEFAULT 45000.00,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  pro_days_remaining INTEGER NOT NULL DEFAULT 0,
  pro_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rate NUMERIC(10, 2) NOT NULL DEFAULT 85.00,
  total_billed NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pending_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pending_hours NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'new')),
  icon_type TEXT NOT NULL DEFAULT 'briefcase',
  logo_url TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela de Registros de Horas / Trabalho (Work Logs)
CREATE TABLE IF NOT EXISTS public.work_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  hourly_rate NUMERIC(10, 2) NOT NULL,
  total_hours NUMERIC(6, 2) NOT NULL,
  total_earnings NUMERIC(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Tabela de Despesas Financeiras
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'tools',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Tabela de Assinaturas Stripe
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - Garante isolamento total por usuário
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas se existirem para evitar conflitos na re-execução
DROP POLICY IF EXISTS "Utilizador pode ver o próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Utilizador pode criar o seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Utilizador pode atualizar o próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Utilizador gere apenas os seus próprios clientes" ON public.clients;
DROP POLICY IF EXISTS "Utilizador gere apenas os seus registros de trabalho" ON public.work_logs;
DROP POLICY IF EXISTS "Utilizador gere apenas as suas próprias despesas" ON public.expenses;
DROP POLICY IF EXISTS "Utilizador gere as suas próprias assinaturas" ON public.subscriptions;

-- Políticas para PROFILES
CREATE POLICY "Utilizador pode ver o próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Utilizador pode criar o seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Utilizador pode atualizar o próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para CLIENTS
CREATE POLICY "Utilizador gere apenas os seus próprios clientes"
  ON public.clients FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para WORK_LOGS
CREATE POLICY "Utilizador gere apenas os seus registros de trabalho"
  ON public.work_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para EXPENSES
CREATE POLICY "Utilizador gere apenas as suas próprias despesas"
  ON public.expenses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para SUBSCRIPTIONS
CREATE POLICY "Utilizador gere as suas próprias assinaturas"
  ON public.subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: Cria linha em profiles quando novo usuário regista
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    avatar_url,
    is_pro,
    pro_days_remaining
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGOCArPMimwqAUW1sAVK8SbpUIN_Ru7u3BtGm3xVjNyxLieeqqzZFY9UYVJjK_K58exjRBkU6PxTOVT0Wn4gUy8mKZC7tmK-2HW2lRFXVYi5BtDku6S8yNj-7SrQLKsufvF_pYSgtprwxxFW5d8_PAnw3akbl9qye86va6kK9-tfSkBRM_Vna0j5iGs8bpdSLeceQA8gE4K_NMuTo_fvCYijfPeEkyx5acp0cfPbghmowK4a-rw3EUgv7Xqwl5jqX4eSviT7HECyY'),
    true, -- Dá 15 dias de trial Pro para novos utilizadores
    15
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove trigger antigo se existir e recria
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices para máxima performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_user_id ON public.work_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_date ON public.work_logs(date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
