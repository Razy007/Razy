import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Lock, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';

export const LoginScreen: React.FC = () => {
  const { loginWithPi, loginAsGuest, loading } = useAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  const content = {
    fr: {
       title: "Academy",
       subtitle: "of Pi",
       slogan: "L'Écosystème d'Apprentissage Web3",
       btnPi: "Démarrer l'Expérience Pi",
       btnGuest: "Continuer en tant qu'Invité",
       loading: "Connexion en cours...",
       security: "Authentification Sécurisée Pi Network 2.0",
       terms: "Conditions",
       privacy: "Confidentialité",
       footer: "Écosystème Éducatif Distribué • Construit pour le Futur",
       agreement: "En vous connectant, vous acceptez nos",
       and: "et notre"
    },
    en: {
       title: "Academy",
       subtitle: "of Pi",
       slogan: "The Web3 Learning Ecosystem",
       btnPi: "Start Pi Experience",
       btnGuest: "Continue as Guest",
       loading: "Connecting...",
       security: "Pi Network Secure Auth 2.0",
       terms: "Terms",
       privacy: "Privacy",
       footer: "Distributed Educational Ecosystem • Built for the Future",
       agreement: "By connecting, you agree to our",
       and: "and our"
    }
  };

  const t = content[lang];

  const toggleLanguage = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('academy_of_pi_language', newLang);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Language Switcher (Absolute Top Right) */}
      <div className="absolute top-6 right-6 z-50">
          <button 
             onClick={toggleLanguage}
             className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full backdrop-blur-md transition-all active:scale-95 group"
          >
             <Globe size={16} className="text-white/40 group-hover:text-yellow-500 transition-colors" />
             <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Français' : 'English'}
             </span>
          </button>
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-3xl border border-white/10 p-10 py-14 rounded-[3rem] shadow-3xl">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-28 h-28 bg-[#0f172a] rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-white/10 transition-transform group-hover:scale-105 duration-700">
              <Logo size={80} />
            </div>
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            {t.title} <span className="text-yellow-500">{t.subtitle}</span>
          </h1>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-4 text-center">
            {t.slogan}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-6">
            <button
                onClick={loginWithPi}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black py-6 px-8 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {loading ? (
                    <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Shield size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                )}
                <span className="uppercase tracking-widest text-xs">{loading ? t.loading : t.btnPi}</span>
            </button>
            
            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink-0 mx-6 text-white/10 text-[9px] font-black uppercase tracking-[0.5em]">OR</span>
                <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
                onClick={loginAsGuest}
                disabled={loading}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white font-black py-6 px-8 rounded-2xl transition-all flex items-center justify-center gap-4 active:scale-95 group"
            >
                <User size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                <span className="uppercase tracking-widest text-xs">{t.btnGuest}</span>
            </button>
        </div>

        {/* Info / Footer */}
        <div className="mt-14 pt-10 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">
                <Lock size={12} className="text-yellow-500/40" />
                <span>{t.security}</span>
            </div>
            <p className="text-[9px] text-white/20 leading-relaxed font-bold mx-auto max-w-[280px] uppercase tracking-wider">
                {t.agreement} <Link to="/terms" className="text-white/40 hover:text-yellow-500 transition underline">{t.terms}</Link> {t.and} <Link to="/privacy" className="text-white/40 hover:text-yellow-500 transition underline">{t.privacy}</Link>.
            </p>
        </div>
      </div>

      <div className="mt-12 text-[9px] font-black text-white/10 uppercase tracking-[0.4em] flex items-center gap-4 text-center">
        <Globe size={14} className="opacity-50 hidden sm:block" />
        <span className="max-w-[300px] sm:max-w-none">{t.footer}</span>
      </div>
    </div>
  );
};
