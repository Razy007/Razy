import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  if (!isOpen) return null;

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
          text: `Vous pouvez staker votre Pi pour des périodes fixes (30, 60, ou 90 jours) avec des taux APR de 5%, 8% et 12%. Les fonds stakés sont bloqués jusqu'à l'expiration. Pas de retrait anticipé possible.`
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
          text: `Academy of Pi est fourni "tel quel" sans garantie. Nous ne sommes pas responsables des pertes de Pi dues à des erreurs utilisateur. Notre contenu est éducatif uniquement et ne constitue pas un conseil en investissement.`
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
        label: "Academy of Pi - Équipe Support",
        email: "Email",
        emailAddress: "support@pioneeracademy.academy",
        support: "Support",
        supportAddress: "support@pioneeracademy.academy",
        website: "Site Web",
        websiteUrl: "https://www.pioneeracademy.academy"
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
          text: `You can stake your Pi for fixed periods (30, 60, or 90 days) with APR rates of 5%, 8% and 12%. Staked funds are locked until expiration. No early withdrawal available.`
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
        label: "Academy of Pi - Support Team",
        email: "Email",
        emailAddress: "support@pioneeracademy.academy",
        support: "Support",
        supportAddress: "support@pioneeracademy.academy",
        website: "Website",
        websiteUrl: "https://www.pioneeracademy.academy"
      },
      footer: {
        copyright: "© 2025 Academy of Pi. All rights reserved.",
        ecosystem: "Part of the Pi Network Ecosystem"
      }
    }
  };

  const t = content[lang];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-30 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size={40} />
              <div>
                <h1 className="text-white font-bold text-lg">{t.title}</h1>
                <p className="text-yellow-400 text-xs">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded-lg transition"
              aria-label="Close"
            >
              <X size={24} className="text-white hover:text-red-400 transition" />
            </button>
</div>
        </div>

        {/* Content */}
        <div className="p-6 py-12">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">{t.title}</h1>
            <p className="text-white/70 mb-8">
              <strong>{t.effectiveDate}:</strong> {t.date}<br />
              <strong>{t.lastUpdated}:</strong> {t.date}
            </p>

            <div className="space-y-8 text-white/90">
              {t.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                  <p className="mb-4 whitespace-pre-line">{section.text}</p>
                </section>
              ))}

              {/* Contact Info */}
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                <p className="font-semibold text-yellow-400">{t.contactInfo.label}</p>
                <p className="text-white/90 mt-2">
                  <strong>{t.contactInfo.email}:</strong> <a href={`mailto:${t.contactInfo.emailAddress}`} className="text-yellow-400 hover:underline">{t.contactInfo.emailAddress}</a><br />
                  <strong>{t.contactInfo.support}:</strong> <a href={`mailto:${t.contactInfo.supportAddress}`} className="text-yellow-400 hover:underline">{t.contactInfo.supportAddress}</a><br />
                  <strong>{t.contactInfo.website}:</strong> {t.contactInfo.websiteUrl}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
              <p>{t.footer.copyright}</p>
              <p className="mt-2">{t.footer.ecosystem}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
