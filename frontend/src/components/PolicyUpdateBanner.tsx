import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface PolicyUpdateBannerProps {
  type: 'privacy' | 'terms';
  version: string;
  onClose: () => void;
  onView: () => void;
}

/**
 * Policy Update Notification Banner
 * Appears when Privacy Policy or Terms of Service are updated
 * Complies with legal requirement to notify users of policy changes
 */
const PolicyUpdateBanner: React.FC<PolicyUpdateBannerProps> = ({
  type,
  version,
  onClose,
  onView
}) => {
  const messages = {
    privacy: {
      fr: "Notre Politique de Confidentialité a été mise à jour. Veuillez la consulter.",
      en: "Our Privacy Policy has been updated. Please review it."
    },
    terms: {
      fr: "Nos Conditions d'Utilisation ont été mises à jour. Veuillez les consulter.",
      en: "Our Terms of Service have been updated. Please review them."
    }
  };

  // Detect language (fallback to English)
  const lang = navigator.language.startsWith('fr') ? 'fr' : 'en';
  const message = messages[type][lang];

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 animate-slideDown">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg shadow-2xl p-4 flex items-center justify-between gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <AlertCircle size={24} className="text-black" />
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="font-bold text-sm">
              {message}
            </p>
            <p className="text-xs opacity-80 mt-1">
              Version: {version} • {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onView}
              className="bg-black text-yellow-400 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-900 transition"
            >
              {lang === 'fr' ? 'Voir' : 'View'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/20 rounded-lg transition"
              aria-label="Close"
            >
              <X size={20} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyUpdateBanner;

// Animation CSS (à ajouter dans index.css ou Tailwind config)
// @keyframes slideDown {
//   from {
//     transform: translateY(-100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateY(0);
//     opacity: 1;
//   }
// }
