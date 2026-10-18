import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { setCurrentScreen, updateUser } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('joao.freelancer@exemplo.com');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('João Silva');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ email, name: fullName.split(' ')[0] || 'João' });
    setCurrentScreen('home');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;

    updateUser({
      name: fullName.split(' ')[0] || 'João',
      email,
      isPro: true,
      proDaysRemaining: 15,
    });
    setShowSuccessModal(true);
  };

  const handleGoogleAuth = () => {
    updateUser({
      name: 'João',
      email: 'joao.google@gmail.com',
      isPro: true,
    });
    setCurrentScreen('home');
  };

  return (
    <div className="font-body-lg text-on-surface min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#faf8ff] relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="fixed top-20 -right-20 w-[400px] h-[400px] bg-primary-container/10 rounded-full blur-[90px] -z-10 pointer-events-none" />
      <div className="fixed -bottom-20 -left-20 w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[90px] -z-10 pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setCurrentScreen('home')}>
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center shadow-md transform rotate-3 text-white">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <span className="font-headline-lg text-2xl font-bold tracking-tight text-primary">
              Tempo & Ganho
            </span>
          </div>
        </div>

        {/* LOGIN VIEW */}
        {!isRegister ? (
          <section className="bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-8 rounded-2xl stripe-shadow animate-fade-in-up">
            <div className="mb-6">
              <h1 className="font-headline-lg-mobile text-2xl font-bold mb-1.5 text-on-surface">
                Bem-vindo de volta
              </h1>
              <p className="text-on-surface-variant font-body-sm text-sm">
                Aceda à sua conta para gerir os seus rendimentos.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="nome@exemplo.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-label-caps text-xs text-on-surface-variant font-semibold">
                    PALAVRA-PASSE
                  </label>
                  <a href="#reset" onClick={(e) => { e.preventDefault(); alert('Link de recuperação enviado para o seu email.'); }} className="text-xs text-primary hover:underline font-medium">
                    Esqueceu-se?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary text-on-primary font-title-md text-sm font-semibold rounded-xl shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Entrar na conta</span>
              </button>

              <div className="relative py-3 flex items-center">
                <div className="flex-grow border-t border-outline-variant/40" />
                <span className="flex-shrink mx-4 text-xs text-outline font-semibold">OU</span>
                <div className="flex-grow border-t border-outline-variant/40" />
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full h-12 bg-surface-container-lowest border border-outline-variant/50 text-on-surface font-title-md text-sm font-semibold rounded-xl hover:bg-surface-container-low active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continuar com Google</span>
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-on-surface-variant font-medium">
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Registe-se agora
              </button>
            </p>
          </section>
        ) : (
          /* REGISTER VIEW */
          <section className="bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-8 rounded-2xl stripe-shadow animate-fade-in-up">
            <div className="mb-6">
              <button
                onClick={() => setIsRegister(false)}
                className="flex items-center gap-1 text-primary text-xs font-bold mb-3 hover:gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                VOLTAR AO LOGIN
              </button>
              <h1 className="font-headline-lg-mobile text-2xl font-bold mb-1 text-on-surface">
                Criar a sua conta
              </h1>
              <p className="text-on-surface-variant font-body-sm text-xs">
                Comece a gerir os seus projetos em segundos.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                  NOME COMPLETO
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="nome@exemplo.com"
                />
              </div>

              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold">
                  PALAVRA-PASSE
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-on-surface-variant leading-relaxed cursor-pointer">
                  Concordo com os{' '}
                  <span className="text-primary underline">Termos de Serviço</span> e{' '}
                  <span className="text-primary underline">Política de Privacidade</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreedTerms}
                className="w-full h-12 bg-primary text-on-primary font-title-md text-sm font-semibold rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                <span>Criar conta gratuita</span>
              </button>
            </form>
          </section>
        )}
      </div>

      {/* SUCCESS MODAL OVERLAY */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-surface-container-lowest w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl border border-primary-container/30">
            <div className="h-32 bg-primary-container relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-surface rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-secondary rounded-full" />
              </div>
              <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span
                  className="material-symbols-outlined text-primary text-[34px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>

            <div className="p-6 text-center">
              <h2 className="font-headline-lg-mobile text-2xl font-bold mb-3 text-on-surface">
                Conta Criada!
              </h2>
              <div className="bg-surface-container-low border border-primary-container/20 p-4 rounded-xl mb-4">
                <p className="text-on-surface text-sm leading-relaxed">
                  🎉 Parabéns! Recebeu acesso gratuito ao{' '}
                  <span className="font-bold text-primary">Plano Pro</span> durante 15 dias.
                </p>
              </div>
              <p className="text-on-surface-variant text-xs mb-6">
                Aproveite todas as ferramentas exclusivas de gestão financeira e produtividade.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCurrentScreen('home');
                }}
                className="w-full h-12 bg-primary text-on-primary font-title-md text-sm font-semibold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
