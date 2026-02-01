import React from 'react';
import { X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  const handleClose = () => {
    // If we have history, go back, otherwise go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  // Cleanup effect to detect any side effects
  React.useEffect(() => {
    console.log('[PrivacyPolicy] Component mounted');
    return () => {
      console.log('[PrivacyPolicy] Component UN-mounting (cleanup)');
    };
  }, []);

  // Bilingual content
  const content = {
    fr: {
      title: "Politique de Confidentialité",
      subtitle: "Academy of Pi",
      effectiveDate: "Date d'Effet",
      lastUpdated: "Dernière Mise à Jour",
      date: "7 janvier 2025",
      sections: [
        {
          title: "1. Introduction",
          text: `Bienvenue sur Academy of Pi. Nous nous engageons à protéger votre vie privée et à assurer la sécurité de vos informations personnelles. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme éducative au sein de l'écosystème Pi Network.`
        },
        {
          title: "2. Informations que Nous Collectons",
          text: `Nous collectons : votre ID utilisateur (UID) et nom d'utilisateur Pi Network, votre progression d'apprentissage (cours complétés, scores de quiz, XP), vos données financières (solde Pi, historique de transactions, positions de staking), vos interactions sociales (posts, commentaires), et des données techniques (type d'appareil, adresse IP).`
        },
        {
          title: "3. Comment Nous Utilisons Vos Informations",
          text: `Nous utilisons vos informations pour : authentifier votre identité via Pi Network, suivre votre progression d'apprentissage, calculer et distribuer des récompenses, traiter les achats in-app, gérer les positions de staking, personnaliser votre expérience, analyser l'utilisation de l'app, et communiquer avec vous.`
        },
        {
          title: "4. Stockage et Sécurité des Données",
          text: `La plupart de vos données sont stockées localement sur votre appareil (localStorage). Pour les utilisateurs authentifiés Pi Network, nous offrons une sauvegarde cloud optionnelle via Firebase. Nous utilisons le chiffrement HTTPS, des wallets non-custodial (nous ne stockons JAMAIS vos clés privées), et effectuons des audits de sécurité réguliers.`
        },
        {
          title: "5. Partage de Données",
          text: `Nous ne vendons JAMAIS vos données personnelles. Nous partageons des informations minimales avec l'écosystème Pi Network (données de transaction, métriques d'utilisation anonymisées). Nous pouvons divulguer des informations si requis par la loi.`
        },
        {
          title: "6. Vos Droits sur la Vie Privée",
          text: `Vous avez le droit d'accéder, corriger, supprimer, exporter vos données, et de désactiver les fonctionnalités de collecte optionnelles.`
        },
        {
          title: "7. Confidentialité des Enfants",
          text: `Academy of Pi est destiné aux utilisateurs âgés de 13 ans et plus. Nous ne collectons pas sciemment d'informations personnelles d'enfants de moins de 13 ans.`
        },
        {
          title: "8. Transferts Internationaux de Données",
          text: `Academy of Pi opère mondialement au sein de l'écosystème Pi Network. Vos données peuvent être transférées et stockées dans des pays en dehors de votre pays de résidence.`
        },
        {
          title: "9. Cookies et Suivi",
          text: `Academy of Pi utilise un minimum de technologies de suivi : localStorage pour sauvegarder votre progression, données de session pour maintenir votre état de connexion, et analytics anonymisées. Nous n'utilisons PAS de cookies publicitaires tiers.`
        },
        {
          title: "10. Modifications de cette Politique",
          text: `Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous notifierons via notification in-app en cas de modifications importantes.`
        },
        {
          title: "11. Nous Contacter",
          text: `Pour toute question concernant cette Politique de Confidentialité ou vos données personnelles :`
        }
      ],
      contactInfo: {
        label: "Academy of Pi - Équipe Confidentialité",
        email: "Email",
        emailAddress: "support@pioneeracademy.academy"
      },
      footer: {
        copyright: "© 2025 Academy of Pi. Tous droits réservés.",
        ecosystem: "Partie de l'Écosystème Pi Network"
      }
    },
    en: {
      title: "Privacy Policy",
      subtitle: "Academy of Pi",
      effectiveDate: "Effective Date",
      lastUpdated: "Last Updated",
      date: "January 7, 2025",
      sections: [
        {
          title: "1. Introduction",
          text: `Welcome to Academy of Pi. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform within the Pi Network ecosystem.`
        },
        {
          title: "2. Information We Collect",
          text: `We collect: your User ID (UID) and username from Pi Network, your learning progress (completed courses, quiz scores, XP), your financial data (Pi balance, transaction history, staking positions), your social interactions (posts, comments), and technical data (device type, IP address).`
        },
        {
          title: "3. How We Use Your Information",
          text: `We use your information to: authenticate your identity via Pi Network, track your learning progress, calculate and distribute rewards, process in-app purchases, manage staking positions, personalize your experience, analyze app usage, and communicate with you.`
        },
        {
          title: "4. Data Storage & Security",
          text: `Most of your data is stored locally on your device (localStorage). For Pi Network authenticated users, we offer optional cloud backup via Firebase. We use HTTPS encryption, non-custodial wallets (we NEVER store your private keys), and conduct regular security audits.`
        },
        {
          title: "5. Data Sharing",
          text: `We will NEVER sell your personal information. We share minimal information with Pi Network ecosystem (transaction data, anonymized usage metrics). We may disclose information if required by law.`
        },
        {
          title: "6. Your Privacy Rights",
          text: `You have the right to access, correct, delete, export your data, and opt-out of optional data collection features.`
        },
        {
          title: "7. Children's Privacy",
          text: `Academy of Pi is intended for users aged 13 and older. We do not knowingly collect personal information from children under 13.`
        },
        {
          title: "8. International Data Transfers",
          text: `Academy of Pi operates globally within the Pi Network ecosystem. Your data may be transferred to and stored in countries outside your country of residence.`
        },
        {
          title: "9. Cookies & Tracking",
          text: `Academy of Pi uses minimal tracking technologies: localStorage to save your progress, session data to maintain your login state, and anonymized analytics. We do NOT use third-party advertising cookies.`
        },
        {
          title: "10. Changes to This Policy",
          text: `We may update this Privacy Policy from time to time. We will notify you via in-app notification when we make material changes.`
        },
        {
          title: "11. Contact Us",
          text: `For questions about this Privacy Policy or your personal data:`
        }
      ],
      contactInfo: {
        label: "Academy of Pi - Privacy Team",
        email: "Email",
        emailAddress: "support@pioneeracademy.academy"
      },
      footer: {
        copyright: "© 2025 Academy of Pi. All rights reserved.",
        ecosystem: "Part of the Pi Network Ecosystem"
      }
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-yellow-500/30">
      {/* Header */}
      <div className="bg-[#0f172a]/80 backdrop-blur-3xl p-6 sticky top-0 z-30 border-b border-white/5 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-black font-black text-xl md:text-2xl shadow-xl shadow-yellow-500/20 transform -rotate-3 group hover:rotate-0 transition-transform duration-500 flex-shrink-0">π</div>
            <div className="min-w-0">
              <h1 className="text-white font-black text-lg md:text-xl tracking-tight leading-none mb-1 truncate">{t.title}</h1>
              <p className="text-yellow-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em] truncate">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             {/* Language Toggle */}
             <button
               onClick={() => i18n.changeLanguage(lang === 'fr' ? 'en' : 'fr')}
               className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white border border-white/5 hover:border-white/10 active:scale-95 flex items-center gap-2"
             >
                <Globe size={20} strokeWidth={2} />
                <span className="text-xs font-bold uppercase hidden md:inline">{lang === 'fr' ? 'EN' : 'FR'}</span>
             </button>

             {/* Close Button */}
             <button
               onClick={handleClose}
               className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white border border-white/5 hover:border-white/10 active:scale-95"
               aria-label="Close"
             >
               <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
             </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-20 shadow-3xl border border-white/5 relative overflow-hidden">
          <h1 className="text-2xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-none break-words">{t.title}</h1>
          <div className="inline-block px-4 py-2 md:px-5 bg-white/5 rounded-xl border border-white/5 mb-10 md:mb-16">
            <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px]">
              {t.effectiveDate}: {t.date} • {t.lastUpdated}: {t.date}
            </p>
          </div>

          <div className="space-y-12 md:space-y-16 text-white/60 leading-relaxed font-medium text-base md:text-lg">
            {t.sections.map((section, index) => (
              <section key={index} className="space-y-4 md:space-y-6 group">
                <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-start md:items-center gap-4 md:gap-6 group-hover:text-yellow-400 transition-colors">
                   <span className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-lg md:rounded-xl flex items-center justify-center text-[10px] text-white/20 border border-white/5 group-hover:bg-yellow-500/10 group-hover:text-yellow-500 transition-all flex-shrink-0">{index + 1}</span>
                   <span className="pt-1 md:pt-0">{section.title.split('. ')[1] || section.title}</span>
                </h2>
                <p className="whitespace-pre-line pl-0 md:pl-16 text-white/40 leading-relaxed group-hover:text-white/60 transition-colors italic md:border-l-2 border-white/5 md:ml-5">{section.text}</p>
              </section>
            ))}

            {/* Contact Info */}
            {/* Contact Info */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-12 mt-20 relative overflow-hidden group hover:bg-white/[0.07] transition-all duration-700">
              <p className="font-black text-yellow-500 uppercase tracking-[0.3em] text-[10px] mb-8">{t.contactInfo.label}</p>
              <div className="relative z-10">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t.contactInfo.email}</p>
                    <a href={`mailto:${t.contactInfo.emailAddress}`} className="text-white font-black text-xl hover:text-yellow-400 transition-all border-b-2 border-white/5 hover:border-yellow-400 pb-1 break-all">{t.contactInfo.emailAddress}</a>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-32 pt-16 border-t border-white/5 text-center space-y-4">
            <p className="text-white/10 font-black uppercase tracking-[0.4em] text-[10px]">{t.footer.copyright}</p>
            <p className="text-yellow-500/20 font-black uppercase tracking-[0.2em] text-[10px]">{t.footer.ecosystem}</p>
          </div>
          
          {/* Subtle noise pattern or carbon fiber */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
