import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LandingScreen: React.FC = () => {
  const { setCurrentScreen, setIsProModalOpen } = useApp();

  // Estados interativos da Landing Page
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'work' | 'clients' | 'finances'>('dashboard');

  // Estados da Calculadora de ROI
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [untrackedHours, setUntrackedHours] = useState<number>(3);

  // Estados do FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Cálculo de ROI
  const monthlyLoss = hourlyRate * untrackedHours;
  const yearlyLoss = monthlyLoss * 12;
  const appMonthlyCost = billingCycle === 'yearly' ? 8.25 : 12.9;
  const roiMultiplier = Math.max(1, Math.round(monthlyLoss / appMonthlyCost));

  const tabContent = {
    dashboard: {
      title: 'Dashboard Geral & Previsão com IA',
      subtitle: 'Visão executiva instantânea de horas trabalhadas, recebimentos, faturas pendentes e meta mensal.',
      image: '/screenshots/app_dashboard.png',
      badge: 'Visão 360° em Tempo Real',
      highlights: [
        'Previsão inteligente de fechamento de mês baseada no seu ritmo diário',
        'Controle visual de meta mensal com barra de progresso intuitiva',
        'Gráfico semanal de rendimento para comparar horas vs ganhos em Euros',
        'Acesso rápido aos clientes mais recentes com status de pagamento',
      ],
    },
    work: {
      title: 'Registo Rápido de Trabalho & Horas',
      subtitle: 'Registe cada hora de projeto com precisão cirúrgica sem complicar o seu dia a dia.',
      image: '/screenshots/app_work_log.png',
      badge: 'Faturação Sem Erros',
      highlights: [
        'Cálculo automático do valor a cobrar multiplicando horas pela taxa do cliente',
        'Histórico detalhado com status imediato: PENDENTE ou PAGO',
        'Filtro por cliente e descrição do serviço executado',
        'Lixeira e edição rápida com um único clique',
      ],
    },
    clients: {
      title: 'Ecossistema & Gestão de Clientes',
      subtitle: 'Acabe com o atraso de pagamentos e saiba quem são os seus clientes mais lucrativos.',
      image: '/screenshots/app_clients.png',
      badge: 'Radar de Faturas em Risco',
      highlights: [
        'Cards visuais com total faturado acumulado e valor pendente em aberto',
        'Taxa horária individualizada configurada por cada cliente',
        'Status ativo, pausado ou novo para melhor organização de pipeline',
        'Acompanhamento de meta e faturamento total da carteira',
      ],
    },
    finances: {
      title: 'Fluxo de Caixa, Lucro Líquido & Fisco Portugal',
      subtitle: 'Controle de despesas categorizadas e cálculo exato de quanto dinheiro realmente sobra.',
      image: '/screenshots/app_finances.png',
      badge: 'Reserva Fiscal Inteligente',
      highlights: [
        'Cálculo automático de Lucro Líquido Disponível descontando despesas',
        'Reserva Fiscal sugerida para IVA e IRS (ideal para recibos verdes em Portugal)',
        'Classificação de despesas: combustível, ferramentas de software, refeições e escritório',
        'Análise inteligente Pro com insights de economia e ranking de faturamento',
      ],
    },
  };

  const currentTab = tabContent[activeTab];

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-body-lg selection:bg-primary-container/20 selection:text-primary overflow-x-hidden">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white text-xs font-semibold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          🇵🇹 Especial Portugal
        </span>
        <span>
          Acesso Completo com <strong>15 Dias Grátis</strong> + <strong>35% de Desconto</strong> no Plano Anual.
        </span>
        <button
          onClick={() => setIsProModalOpen(true)}
          className="hidden md:inline-flex items-center gap-1 underline font-bold hover:text-white/80 cursor-pointer ml-1"
        >
          Aproveitar Oferta →
        </button>
      </div>

      {/* 2. STICKY MODERN NAVBAR */}
      <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-outline-variant/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-[24px]">timelapse</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-extrabold tracking-tight font-headline-lg text-on-surface">
                Tempo & Ganho
              </span>
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                PRO
              </span>
            </div>
          </div>

          {/* Navigation Anchors (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-on-surface-variant">
            <a href="#como-funciona" className="hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#por-dentro" className="hover:text-primary transition-colors">
              Por Dentro do App
            </a>
            <a href="#calculadora-roi" className="hover:text-primary transition-colors">
              Calculadora de Ganhos
            </a>
            <a href="#precos" className="hover:text-primary transition-colors">
              Planos & Preços
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              Dúvidas
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('home')}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
              title="Abrir a aplicação"
            >
              Aceder ao App (Demo)
            </button>
            <button
              onClick={() => setCurrentScreen('auth')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => setIsProModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:brightness-110 active:scale-95 shadow-md shadow-primary/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Começar Grátis</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (HIGH IMPACT & CONVERSION) */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Ambient Lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-primary-container/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-40 right-[-100px] w-[400px] h-[400px] bg-secondary-container/15 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest border border-primary/20 shadow-xs mb-6 animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">
              A Solução Definitiva Para Prestadores de Serviços em Portugal
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface max-w-4xl mx-auto font-headline-lg leading-[1.15] mb-6">
            Pare de perder dinheiro por falta de controlo.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">
              Saiba exatamente quanto fatura por hora e o seu lucro real.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            O software de gestão financeira e registo de horas feito à medida para freelancers, consultores e pequenas agências em Portugal. 
            Controle clientes, preveja retenções fiscais de IRS e nunca mais deixe uma hora passar sem faturar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setIsProModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Testar 15 Dias Grátis Agora</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 text-on-surface font-semibold text-base shadow-xs hover:bg-surface-container-low active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
              <span>Explorar Demonstração Interativa</span>
            </button>
          </div>

          {/* Trust Social Proof Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs font-medium text-on-surface-variant mb-16">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 font-bold">★★★★★</span>
              <span className="text-on-surface font-semibold">4.9/5</span>
              <span>avaliação média</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
              <span>14 Dias de Garantia de Satisfação</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">credit_card_off</span>
              <span>Sem fidelização • Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">cloud_done</span>
              <span>Dados salvos em nuvem segura</span>
            </div>
          </div>

          {/* HERO SHOWCASE WITH FLOATING BADGES & REAL APP SCREENSHOT */}
          <div className="relative max-w-5xl mx-auto">
            {/* Ambient Shadow glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent blur-3xl -z-10 rounded-3xl" />

            {/* Floating Badge 1 - Top Left */}
            <div className="hidden lg:flex absolute -top-6 -left-8 z-20 bg-surface-container-lowest/90 backdrop-blur-md p-3.5 rounded-2xl border border-outline-variant/40 shadow-xl items-center gap-3 animate-float-slow">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Fatura Liquidada</div>
                <div className="text-sm font-bold text-on-surface">€765,00 • Tech Solutions</div>
              </div>
            </div>

            {/* Floating Badge 2 - Top Right */}
            <div className="hidden lg:flex absolute top-12 -right-8 z-20 bg-surface-container-lowest/90 backdrop-blur-md p-3.5 rounded-2xl border border-outline-variant/40 shadow-xl items-center gap-3 animate-float-reverse">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-primary uppercase tracking-wider">Previsão Fecho de Mês</div>
                <div className="text-sm font-bold text-on-surface">€3.124,00 (+12% vs mês ant.)</div>
              </div>
            </div>

            {/* Floating Badge 3 - Bottom Left */}
            <div className="hidden lg:flex absolute -bottom-6 left-12 z-20 bg-surface-container-lowest/90 backdrop-blur-md p-3.5 rounded-2xl border border-outline-variant/40 shadow-xl items-center gap-3 animate-float-slow">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">Reserva Fiscal Portugal</div>
                <div className="text-sm font-bold text-on-surface">€520,00 guardados (IVA/IRS)</div>
              </div>
            </div>

            {/* Browser Frame Window Mockup */}
            <div className="bg-surface-container-lowest rounded-3xl p-2.5 sm:p-3.5 border border-outline-variant/40 shadow-2xl overflow-hidden transition-all hover:border-primary/30">
              {/* Browser Dots Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/20 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="px-3 py-1 bg-surface-container-low rounded-lg text-[11px] font-code text-on-surface-variant/80 border border-outline-variant/20">
                  app.tempoganho.pt/dashboard
                </div>
                <div className="w-10" />
              </div>

              {/* Real App Screenshot Image */}
              <div className="rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface">
                <img
                  src="/screenshots/app_dashboard.png"
                  alt="Dashboard Principal do Tempo & Ganho"
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.01]"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PAIN VS SOLUTION (A REALIDADE DO PRESTADOR DE SERVIÇOS EM PORTUGAL) */}
      <section id="como-funciona" className="py-20 bg-surface-container-low/60 border-y border-outline-variant/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2 font-label-caps">
              IDENTIFICA-SE COM ESTAS SITUAÇÕES?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-on-surface font-headline-lg tracking-tight">
              Prestar serviços já é desafiante. Gerir o seu dinheiro não deveria ser uma dor de cabeça.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">hourglass_disabled</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 font-title-md">
                  Horas Perdidas Sem Faturar
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Reuniões de alinhamento, ajustes de última hora e pedidos extras que você acaba por não registar e faz "de graça".
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/20 text-[11px] font-bold text-primary flex items-center gap-1">
                <span>Com o App: Registo com 1 clique</span>
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">pending_actions</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 font-title-md">
                  Faturas Esquecidas por Cobrar
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Clientes que demoram 30 a 60 dias para pagar e você nem se lembra exatamente quem está em dívida.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/20 text-[11px] font-bold text-primary flex items-center gap-1">
                <span>Com o App: Radar de pagamentos pendentes</span>
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">receipt_long</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 font-title-md">
                  O Susto do IRS & Seg. Social
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Faturar muito num mês e ver o dinheiro evaporar na declaração trimestral por não ter feito uma reserva fiscal prévia.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/20 text-[11px] font-bold text-primary flex items-center gap-1">
                <span>Com o App: Sugestão de reserva automática</span>
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">table_view</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-2 font-title-md">
                  Planilhas Confusas do Excel
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Ficheiros pesados e cheios de fórmulas que você começa a usar mas abandona na segunda semana por serem chatos.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/20 text-[11px] font-bold text-primary flex items-center gap-1">
                <span>Com o App: Interface linda no telemóvel e PC</span>
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE APP SHOWCASE (POR DENTRO DO APP - REAL SCREENSHOTS) */}
      <section id="por-dentro" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2 font-label-caps">
            INTERFACE LIMPA, RÁPIDA E ELEGANTE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface font-headline-lg tracking-tight mb-4">
            Veja como o Tempo & Ganho funciona por dentro
          </h2>
          <p className="text-on-surface-variant text-base">
            Clique nas abas abaixo para conhecer as principais áreas do sistema em detalhes.
          </p>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Dashboard & Metas</span>
          </button>

          <button
            onClick={() => setActiveTab('work')}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'work'
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">more_time</span>
            <span>Registo de Trabalho</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'clients'
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>Gestão de Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab('finances')}
            className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'finances'
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span>Fluxo de Caixa & Fisco</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 md:p-10 border border-outline-variant/30 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>{currentTab.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline-lg">
              {currentTab.title}
            </h3>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {currentTab.subtitle}
            </p>

            <div className="space-y-3.5 pt-2">
              {currentTab.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">done</span>
                  </div>
                  <span className="text-xs sm:text-sm text-on-surface font-medium leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsProModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Experimentar esta tela no teste grátis</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Screenshot Showcase with Zoom effect */}
          <div className="lg:col-span-7">
            <div className="bg-surface rounded-2xl p-2 sm:p-3 border border-outline-variant/30 shadow-lg overflow-hidden group relative">
              <div className="rounded-xl overflow-hidden bg-white border border-outline-variant/20">
                <img
                  src={currentTab.image}
                  alt={currentTab.title}
                  className="w-full h-auto object-cover rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 pointer-events-none">
                <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                <span>Captura real do software</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ROI CALCULATOR (QUANTO VOCÊ ESTÁ PERDENDO SEM O APP) */}
      <section id="calculadora-roi" className="py-20 bg-gradient-to-b from-[#faf8ff] to-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2 font-label-caps">
              SIMULADOR DE RETORNO SOBRE O INVESTIMENTO
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-on-surface font-headline-lg tracking-tight mb-3">
              Descubra quanto dinheiro está a deixar na mesa todos os meses
            </h2>
            <p className="text-sm text-on-surface-variant">
              Ajuste a sua taxa horária média e veja como o software se paga nos primeiros dias.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Input */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-label-caps">
                    Sua taxa horária (€/hora)
                  </label>
                  <span className="text-lg font-bold text-primary font-code bg-primary/10 px-3 py-0.5 rounded-lg">
                    €{hourlyRate}/h
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="150"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
                  <span>€15/h</span>
                  <span>€75/h</span>
                  <span>€150/h</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-label-caps">
                    Horas não faturadas / esquecidas por mês
                  </label>
                  <span className="text-lg font-bold text-secondary font-code bg-secondary/10 px-3 py-0.5 rounded-lg">
                    {untrackedHours}h / mês
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={untrackedHours}
                  onChange={(e) => setUntrackedHours(Number(e.target.value))}
                  className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
                  <span>1 hora</span>
                  <span>5 horas</span>
                  <span>10 horas</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
                💡 <em>"A maioria dos prestadores de serviços perde entre 2 a 5 horas por mês em pequenas revisões, reuniões extras e mensagens que nunca chegam a constar na fatura final."</em>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="bg-gradient-to-br from-primary via-primary-container to-secondary text-white p-8 rounded-2xl shadow-xl text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <span className="text-[11px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block">
                POTENCIAL DE GANHO RECUPERADO
              </span>

              <div>
                <div className="text-xs font-medium text-white/80">Dinheiro perdido sem controlo:</div>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight my-1 font-headline-lg">
                  €{monthlyLoss}
                  <span className="text-sm font-normal text-white/80"> / mês</span>
                </div>
                <div className="text-xs text-white/90 font-medium">
                  Equivalente a <strong>€{yearlyLoss} por ano</strong> deixados na mesa!
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 text-xs text-white/90 leading-relaxed">
                O Tempo & Ganho Pro custa apenas <strong>€{appMonthlyCost.toFixed(2)}/mês</strong>.
                Ao recuperar essas horas, o aplicativo dá um retorno de{' '}
                <span className="px-2 py-0.5 bg-emerald-400 text-emerald-950 rounded-md font-bold text-xs inline-block">
                  {roiMultiplier}x o investimento
                </span>!
              </div>

              <button
                onClick={() => setIsProModalOpen(true)}
                className="w-full py-3.5 bg-white text-primary font-bold text-xs rounded-xl shadow-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer mt-2"
              >
                Parar de Perder Dinheiro Hoje
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING TIERS SECTION (PREÇOS JUSTOS PARA PORTUGAL) */}
      <section id="precos" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2 font-label-caps">
            PLANOS SIMPLES E TRANSPARENTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface font-headline-lg tracking-tight mb-4">
            Investimento acessível com retorno imediato
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base">
            Sem contratos longos, sem taxas escondidas. Cancele com um único clique a qualquer momento.
          </p>

          {/* Toggle Mensal / Anual */}
          <div className="inline-flex items-center p-1.5 bg-surface-container rounded-2xl border border-outline-variant/30 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Anual</span>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] rounded-full uppercase font-bold tracking-wider">
                Poupa 35%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card Mensal */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-between text-left hover:border-outline-variant transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-on-surface font-headline-lg">Plano Mensal</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                  Flexibilidade Total
                </span>
              </div>

              <p className="text-xs text-on-surface-variant mb-6">
                Ideal para quem deseja experimentar mês a mês sem qualquer compromisso a longo prazo.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-on-surface font-headline-lg">€12,90</span>
                  <span className="text-xs font-medium text-on-surface-variant">/ mês</span>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1">Faturado mensalmente • Cancele quando quiser</div>
              </div>

              <div className="space-y-3 text-xs text-on-surface border-t border-outline-variant/20 pt-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Registo de horas e cálculo automático por cliente</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Radar de faturas pendentes e clientes atrasados</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Fluxo de caixa com controle de despesas</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Sincronização em nuvem segura Supabase</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsProModalOpen(true)}
              className="w-full mt-8 py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-xs hover:bg-primary/5 active:scale-95 transition-all cursor-pointer text-center"
            >
              Começar Teste de 15 Dias
            </button>
          </div>

          {/* Card Anual (DESTAQUE) */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl border-2 border-primary shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary-container text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              ✦ MAIS ESCOLHIDO
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-on-surface font-headline-lg">Plano Anual</h3>
              </div>

              <p className="text-xs text-on-surface-variant mb-6">
                Para profissionais que levam o seu negócio a sério e querem a máxima economia anual.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-primary font-headline-lg">€8,25</span>
                  <span className="text-xs font-medium text-on-surface-variant">/ mês</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  €99 faturados anualmente (Poupa €55,80 vs plano mensal!)
                </div>
              </div>

              <div className="space-y-3 text-xs text-on-surface border-t border-outline-variant/20 pt-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span><strong>Tudo do Plano Mensal incluído</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span><strong>Assistente Financeiro IA</strong> com respostas personalizadas</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span><strong>Simulador Fiscal IRS & Segurança Social</strong> (Portugal)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Clientes ilimitados e relatórios completos</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span>Suporte prioritário via WhatsApp / Email</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => setIsProModalOpen(true)}
                className="w-full mt-8 py-4 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Garantir Acesso Anual com 35% OFF</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <div className="text-center text-[10px] text-on-surface-variant mt-2">
                14 dias de garantia incondicional de devolução
              </div>
            </div>
          </div>
        </div>

        {/* Stripe Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">lock</span>
            <span>Pagamento Seguro processado via <strong>Stripe</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">credit_card</span>
            <span>Multibanco, MBWay, Cartão de Crédito e Apple Pay</span>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (DEPOIMENTOS DE PORTUGAL) */}
      <section className="py-20 bg-surface-container-low/50 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2 font-label-caps">
            QUEM USA RECOMENDA
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-on-surface font-headline-lg tracking-tight mb-12">
            O que dizem os prestadores de serviços em Portugal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Depoimento 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed italic">
                "No primeiro mês recuperei cerca de €850 em faturas que dois clientes se esqueceram de pagar. O radar de faturas pendentes paga o software pelo ano inteiro."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                  CM
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Carlos Mendes</div>
                  <div className="text-[11px] text-on-surface-variant">Desenvolvedor Web Freelancer • Lisboa</div>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed italic">
                "A estimativa de reserva para IRS e Segurança Social salvou o meu planeamento. Deixei de ter medo do final do trimestre porque já sei exatamente quanto posso gastar."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center text-xs">
                  SA
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Sofia Antunes</div>
                  <div className="text-[11px] text-on-surface-variant">Designer UI/UX & Branding • Porto</div>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed italic">
                "Substituiu 3 planilhas do Excel confusas. Abro no telemóvel quando termino uma reunião e registo o tempo em 5 segundos. Não largo mais."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-600 font-bold flex items-center justify-center text-xs">
                  MR
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Miguel Ribeiro</div>
                  <div className="text-[11px] text-on-surface-variant">Consultor de Marketing Digital • Braga</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION (PERGUNTAS FREQUENTES) */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2 font-label-caps">
            TIRE TODAS AS SUAS DÚVIDAS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline-lg tracking-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Preciso de colocar cartão de crédito para testar?',
              a: 'Não! O teste gratuito de 15 dias é totalmente livre. Você cria a sua conta, explora todas as ferramentas Pro e só decide assinar se o software realmente provar que traz retorno para si.',
            },
            {
              q: 'O aplicativo está adaptado para o regime fiscal de Portugal?',
              a: 'Sim. O sistema foi desenvolvido a pensar nos profissionais independentes (Recibos Verdes) e pequenas empresas em Portugal, com simulação de reserva de IRS e Segurança Social.',
            },
            {
              q: 'Posso usar no telemóvel e no computador ao mesmo tempo?',
              a: 'Sim, o Tempo & Ganho é 100% responsivo e sincronizado em nuvem via Supabase. Tudo o que você registar no telemóvel fica disponível imediatamente no computador do escritório.',
            },
            {
              q: 'Como funciona o cancelamento?',
              a: 'Você tem controlo total através do Portal do Cliente Stripe. Pode cancelar com um único clique a qualquer momento, sem multas, perguntas ou contratos de fidelização.',
            },
            {
              q: 'Os meus dados e informações de clientes estão seguros?',
              a: 'Totalmente seguros. Utilizamos encriptação de ponta a ponta e a infraestrutura segura do Supabase (PostgreSQL com Row Level Security), garantindo que apenas você tem acesso aos seus dados.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 text-left font-bold text-sm text-on-surface flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low/50"
              >
                <span>{item.q}</span>
                <span className={`material-symbols-outlined text-[20px] text-primary transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-primary via-primary-container to-secondary rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block mb-4">
            GARANTA O SEU ACESSO HOJE
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-headline-lg tracking-tight mb-4">
            Pronto para ter controlo total do seu tempo e faturamento?
          </h2>

          <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Junte-se aos prestadores de serviços que já deixaram para trás as planilhas confusas e faturam cada hora com precisão.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsProModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-primary font-bold text-sm shadow-xl hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Começar 15 Dias Grátis Agora</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 active:scale-95 transition-all cursor-pointer"
            >
              Ver Demonstração do App
            </button>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-surface-container-low border-t border-outline-variant/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
              TG
            </div>
            <span className="font-bold text-on-surface text-sm">Tempo & Ganho Pro</span>
            <span>• © {new Date().getFullYear()} Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button onClick={() => setCurrentScreen('home')} className="hover:text-primary transition-colors cursor-pointer">
              Entrar no App
            </button>
            <button onClick={() => setIsProModalOpen(true)} className="hover:text-primary transition-colors cursor-pointer">
              Planos & Preços
            </button>
            <a href="#faq" className="hover:text-primary transition-colors">
              Perguntas Frequentes
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
