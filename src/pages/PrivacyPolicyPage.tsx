import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  const handleClose = () => {
    navigate(-1);
  };

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
        emailAddress: "privacy@pioneeracademy.academy",
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
        emailAddress: "privacy@pioneeracademy.academy",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={40} />
            <div>
              <h1 className="text-white font-bold text-lg">{t.title}</h1>
              <p className="text-yellow-400 text-xs">{t.subtitle}</p>
            </div>
          </div>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-red-500/20 rounded-lg transition"
            aria-label="Close"
          >
            <X size={24} className="text-white hover:text-red-400 transition" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 py-12">
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
  );
};

export default PrivacyPolicyPage;
