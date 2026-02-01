import React from 'react';
import { X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const TermsOfServicePage: React.FC = () => {
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
    console.log('[TermsOfService] Component mounted');
    return () => {
      console.log('[TermsOfService] Component UN-mounting (cleanup)');
    };
  }, []);

  // Bilingual content
  const content = {
    fr: {
      title: "Conditions d'Utilisation",
      subtitle: "Academy of Pi",
      effectiveDate: "Date d'Effet",
      lastUpdated: "Dernière Mise à Jour",
      date: "7 janvier 2025",
      sections: [
        {
          title: "1. Acceptation des Conditions",
          text: `Bienvenue sur Academy of Pi ("nous", "notre" ou "la Plateforme"). En accédant ou en utilisant notre plateforme éducative au sein de l'écosystème Pi Network, vous acceptez d'être lié par ces Conditions d'Utilisation ("Conditions"). Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser la Plateforme.`
        },
        {
          title: "2. Éligibilité",
          text: `Pour utiliser Academy of Pi, vous devez avoir au moins 13 ans, posséder un compte Pi Network valide, et accepter notre Politique de Confidentialité.`
        },
        {
          title: "3. Responsabilités de l'Utilisateur",
          text: `Vous acceptez de : utiliser la Plateforme de manière légale et éthique, ne pas partager votre passphrase, ne pas tricher ou manipuler les systèmes de quiz, ne pas créer plusieurs comptes, ne pas utiliser de bots, et respecter les autres utilisateurs.`
        },
        {
          title: "4. Services Éducatifs",
          text: `Academy of Pi fournit des cours éducatifs sur Pi Network, blockchain et DeFi, des quiz et évaluations, un système XP et de niveau, et des récompenses en cryptomonnaie Pi. Le contenu est fourni à titre informatif uniquement et ne constitue pas un conseil financier.`
        },
        {
          title: "5. Cryptomonnaie Pi et Récompenses",
          text: `Compléter des cours vous récompense en Pi. Nous utilisons un wallet non-custodial - nous ne stockons PAS vos clés privées. Les récompenses Pi gagnées ne sont pas remboursables.`
        },
        {
          title: "6. Staking et APR",
          text: `Vous pouvez staker votre Pi pour des périodes fixes (7, 30, ou 90 jours) avec des taux APR de 2%, 8% et 15%. Les fonds stakés sont bloqués jusqu'à l'expiration. Pas de retrait anticipé possible.`
        },
        {
          title: "7. Achats In-App",
          text: `Vous pouvez acheter de l'énergie avec du Pi. Les achats sont finaux et non remboursables sauf erreur technique de notre part.`
        },
        {
          title: "8. Propriété Intellectuelle",
          text: `Tous les cours, quiz et matériels sont notre propriété. Vous pouvez les utiliser à des fins personnelles et éducatives uniquement.`
        },
        {
          title: "9. Avertissements et Limitations",
          text: `Academy of Pi est fourni "tel quel" sans garantie. Nous ne sommes pas responsables des pertes de Pin dues à des erreurs utilisateur. Notre contenu est éducatif uniquement et ne constitue pas un conseil en investissement.`
        },
        {
          title: "10. Résiliation",
          text: `Nous pouvons suspendre ou résilier votre compte en cas de violation des Conditions, fraude, tricherie, ou abus de la Plateforme.`
        },
        {
          title: "11. Modifications des Conditions",
          text: `Nous pouvons mettre à jour ces Conditions de temps à autre. Nous vous notifierons via notification in-app en cas de modifications importantes.`
        },
        {
          title: "12. Nous Contacter",
          text: `Pour toute question concernant ces Conditions :`
        }
      ],
      contactInfo: {
        label: "Academy of Pi - Équipe Légale",
        email: "Email",
        emailAddress: "support@pioneeracademy.academy"
      },
      footer: {
        copyright: "© 2025 Academy of Pi. Tous droits réservés.",
        ecosystem: "Partie de l'Écosystème Pi Network"
      }
    },
    en: {
      title: "Terms of Service",
      subtitle: "Academy of Pi",
      effectiveDate: "Effective Date",
      lastUpdated: "Last Updated",
      date: "January 7, 2025",
      sections: [
        {
          title: "1. Acceptance of Terms",
          text: `Welcome to Academy of Pi ("we," "our," or "the Platform"). By accessing or using our educational platform within the Pi Network ecosystem, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Platform.`
        },
        {
          title: "2. Eligibility",
          text: `To use Academy of Pi, you must be at least 13 years old, have a valid Pi Network account, and agree to our Privacy Policy.`
        },
        {
          title: "3. User Responsibilities",
          text: `You agree to: use the Platform lawfully and ethically, not share your passphrase, not cheat or manipulate quiz systems, not create multiple accounts, not use bots, and respect other users.`
        },
        {
          title: "4. Educational Services",
          text: `Academy of Pi provides educational courses on Pi Network, blockchain and DeFi, quizzes and assessments, XP and leveling system, and rewards in Pi cryptocurrency. Content is provided for informational purposes only and does not constitute financial advice.`
        },
        {
          title: "5. Pi Cryptocurrency & Rewards",
          text: `Completing courses rewards you with Pi. We use a non-custodial wallet - we do NOT store your private keys. Pi rewards earned are non-refundable.`
        },
        {
          title: "6. Staking & APR",
          text: `You can stake your Pi for fixed periods (7, 30, or 90 days) with APR rates of 2%, 8% and 15%. Staked funds are locked until expiration. No early withdrawal available.`
        },
        {
          title: "7. In-App Purchases",
          text: `You can purchase energy with Pi. Purchases are final and non-refundable except for technical errors on our part.`
        },
        {
          title: "8. Intellectual Property",
          text: `All courses, quizzes, and materials are our property. You may use them for personal, educational purposes only.`
        },
        {
          title: "9. Disclaimers & Limitations",
          text: `Academy of Pi is provided "as is" without warranty. We are not liable for Pi losses due to user error. Our content is educational only and does not constitute investment advice.`
        },
        {
          title: "10. Termination",
          text: `We may suspend or terminate your account for violating these Terms, fraud, cheating, or abuse of the Platform.`
        },
        {
          title: "11. Changes to Terms",
          text: `We may update these Terms from time to time. We will notify you via in-app notification when we make material changes.`
        },
        {
          title: "12. Contact Us",
          text: `For questions about these Terms:`
        }
      ],
      contactInfo: {
        label: "Academy of Pi - Legal Team",
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
             <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-black font-black text-xl md:text-2xl shadow-xl shadow-yellow-500/20 transform rotate-3 group hover:rotate-0 transition-transform duration-500 flex-shrink-0">π</div>
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
          
          {/* Subtle noise pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
