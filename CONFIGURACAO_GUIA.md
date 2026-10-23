# 🚀 Guia Completo de Configuração: Supabase, Stripe e Vercel
## SaaS Tempo & Ganho

Este guia contém o passo a passo direto e detalhado para você conectar o **Supabase** (Banco de dados e Autenticação), **Stripe** (Assinaturas e Checkout Pro) e **Vercel** (Hospedagem e Rotas Serverless).

---

## 📋 Resumo das Variáveis de Ambiente (.env)

| Variável | Onde obter | Finalidade |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase > Project Settings > API | URL da sua instância Supabase |
| `VITE_SUPABASE_ANON_KEY` | Supabase > Project Settings > API | Chave pública anónima para o frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API | Chave secreta de servidor para Webhooks |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe > Developers > API keys | Chave pública `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe > Developers > API keys | Chave secreta `sk_test_...` (apenas servidor) |
| `STRIPE_WEBHOOK_SECRET` | Stripe > Developers > Webhooks | Segredo `whsec_...` para autenticar eventos |
| `VITE_STRIPE_PRICE_MONTHLY_ID` | Stripe > Catálogo de Produtos | ID do Preço Mensal (`price_...`) |
| `VITE_STRIPE_PRICE_YEARLY_ID` | Stripe > Catálogo de Produtos | ID do Preço Anual (`price_...`) |
| `VITE_APP_URL` | Local ou Domínio Vercel | URL base (`http://localhost:3000` ou `https://seu-app.vercel.app`) |

---

## 1. ⚡ Configuração do Supabase (Banco de Dados & Autenticação)

### Passo 1.1: Criar o Projeto
1. Acesse [supabase.com](https://supabase.com) e inicie sessão ou crie uma conta gratuita.
2. Clique em **"New Project"**, escolha uma organização, defina um nome (ex: `tempo-e-ganho`) e uma senha forte para o banco de dados.
3. Escolha uma região próxima (ex: *Frankfurt* ou *São Paulo*).

### Passo 1.2: Executar o Script do Banco de Dados
1. No menu lateral esquerdo do Supabase, clique em **SQL Editor** (ícone de terminal).
2. Clique no botão **"New query"**.
3. Abra o ficheiro [`supabase_schema.sql`](file:///c:/Users/Bruno%20Leandro/Desktop/Tempo&ganho/supabase_schema.sql) na raiz deste projeto, copie todo o seu conteúdo e cole no editor do Supabase.
4. Clique no botão verde **Run** (Executar).
5. O Supabase criará automaticamente:
   - Tabelas: `profiles`, `clients`, `work_logs`, `expenses`, `subscriptions`
   - Políticas RLS (Row Level Security) que garantem isolamento total dos dados de cada usuário
   - Trigger automático que cria o perfil do usuário e oferece 15 dias de Pro grátis no registo.

### Passo 1.3: Copiar as Chaves de API
1. No menu lateral esquerdo, vá em **Project Settings** (ícone de engrenagem) > **API**.
2. Copie:
   - **Project URL** ➔ coloque em `VITE_SUPABASE_URL` no ficheiro `.env`
   - **anon public** ➔ coloque em `VITE_SUPABASE_ANON_KEY` no ficheiro `.env`
   - **service_role secret** ➔ coloque em `SUPABASE_SERVICE_ROLE_KEY` no ficheiro `.env`

### Passo 1.4: Configurar URLs de Redirecionamento de Auth
1. No menu lateral esquerdo, vá em **Authentication** > **URL Configuration**.
2. Em **Site URL**, defina a URL da sua aplicação (ex: `http://localhost:3000` ou `https://seu-app.vercel.app`).
3. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/**`
   - `https://seu-app.vercel.app/**` (após criar o deploy na Vercel)

---

## 2. 💳 Configuração do Stripe (Pagamentos & Planos Pro)

### Passo 2.1: Obter as Chaves de API
1. Acesse o [dashboard.stripe.com](https://dashboard.stripe.com).
2. Certifique-se de que o modo de teste está ativado (**Test Mode** no canto superior direito).
3. Vá em **Developers** > **API keys**.
4. Copie:
   - **Publishable key** (`pk_test_...`) ➔ cole em `VITE_STRIPE_PUBLISHABLE_KEY` no `.env`
   - **Secret key** (`sk_test_...`) ➔ cole em `STRIPE_SECRET_KEY` no `.env`

### Passo 2.2: Criar os Produtos e Preços dos Planos
1. No menu do Stripe, vá em **Product catalog** (Catálogo de produtos) > **Add product** (Adicionar produto).
2. Crie o produto:
   - **Nome**: `Tempo & Ganho Pro - Mensal`
   - **Preço**: `€9.90` (ou `R$ 49.00`)
   - **Cobrança**: Recorrente (Mensal)
   - Salve e copie o **Price ID** gerado (`price_...`) ➔ cole em `VITE_STRIPE_PRICE_MONTHLY_ID`.
3. Adicione o segundo preço ou produto:
   - **Nome**: `Tempo & Ganho Pro - Anual`
   - **Preço**: `€89.90` (ou `R$ 468.00`)
   - **Cobrança**: Recorrente (Anual)
   - Salve e copie o **Price ID** gerado (`price_...`) ➔ cole em `VITE_STRIPE_PRICE_YEARLY_ID`.

*(Opcional: Caso prefira criar "Payment Links" rápidos no painel do Stripe em vez de usar Price IDs, pode colar os links em `VITE_STRIPE_PAYMENT_LINK_MONTHLY` e `VITE_STRIPE_PAYMENT_LINK_YEARLY` no `.env`)*.

### Passo 2.3: Configurar o Webhook do Stripe (Atualização Automática de Status)
1. No painel do Stripe, vá em **Developers** > **Webhooks** > **Add destination** (Adicionar endpoint).
2. Em **Endpoint URL**, insira:
   ```text
   https://seu-projeto.vercel.app/api/stripe-webhook
   ```
   *(Substitua `seu-projeto.vercel.app` pelo domínio real gerado na Vercel no passo seguinte)*.
3. Clique em **Select events** e selecione os seguintes eventos:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Após criar o endpoint, clique em **Reveal signing secret** (Revelar segredo de assinatura).
5. Copie a chave iniciada por `whsec_...` ➔ cole em `STRIPE_WEBHOOK_SECRET` no `.env` e nas variáveis da Vercel.

---

## 3. ▲ Configuração da Vercel (Deploy e Serverless)

O projeto já inclui o ficheiro [`vercel.json`](file:///c:/Users/Bruno%20Leandro/Desktop/Tempo&ganho/vercel.json) configurado com rotas serverless em `/api` e suporte completo a SPA (Single Page Application).

### Passo 3.1: Enviar o Código para o GitHub
Se ainda não enviou as alterações para o seu repositório:
```bash
git add .
git commit -m "feat: integracao supabase stripe e vercel"
git push origin main
```

### Passo 3.2: Importar o Projeto na Vercel
1. Acesse [vercel.com](https://vercel.com) e inicie sessão com a sua conta GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Selecione o repositório `Tempo-Ganho`.
4. As configurações padrão são detectadas automaticamente:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Passo 3.3: Configurar as Variáveis de Ambiente na Vercel
Antes de clicar em Deploy, expanda a secção **"Environment Variables"** e adicione as variáveis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `VITE_STRIPE_PRICE_MONTHLY_ID`
- `VITE_STRIPE_PRICE_YEARLY_ID`
- `VITE_APP_URL` (coloque o domínio da Vercel ou o seu domínio personalizado)

5. Clique em **Deploy**.
6. Em menos de 1 minuto, a aplicação estará online com certificado SSL gratuito e alta disponibilidade global!

---

## 🧪 Como Testar Tudo Localmente Antes do Deploy

1. Abra o ficheiro [`.env`](file:///c:/Users/Bruno%20Leandro/Desktop/Tempo&ganho/.env) e preencha as suas chaves do Supabase e Stripe.
2. No terminal do VS Code / Antigravity, inicie o servidor:
   ```bash
   npm run dev
   ```
3. Abra a aplicação no navegador em `http://localhost:3000`.
4. Acesse o ecrã de **Definições & Perfil** e veja o painel **"Estado das Integrações"**:
   - Supabase: 🟢 Nuvem Ativa
   - Stripe: 🟢 Online
   - Vercel: 🟢 Pronto
5. Teste o registo de conta, cadastro de cliente e clique em "Ativar Pro" para testar o checkout!
