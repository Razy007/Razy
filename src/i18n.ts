import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 🇫🇷 French (Default)
const fr = {
  translation: {
    common: {
      loading: "Chargement...",
      submit: "Envoyer",
      cancel: "Annuler",
      close: "Fermer",
      save: "Sauvegarder",
      delete: "Supprimer",
      confirm: "Confirmer",
      next: "Suivant",
      back: "Retour",
      finish: "Terminer",
      error: "Erreur",
      success: "Succès"
    },
    nav: {
      courses: "Cours",
      leaderboard: "Classement",
      social: "Social",
      shop: "Boutique",
      profile: "Profil"
    },
    stats: {
      level: "Niveau",
      xp: "XP Total",
      balance: "Solde",
      rank: "Rang",
      streak: "Série",
      xpDetail: "XP / Suivant"
    },
    auth: {
      guest_mode: "Mode Invité - Progrès non sauvegardés",
      login_pi: "Connexion avec Pi Network"
    },
    course: {
      locked: "Verrouillé",
      start: "Commencer",
      continue: "Continuer",
      completed: "Terminé",
      modules: "Module",
      time: "min",
      reward: "Récompense",
      quiz: "Quiz",
      discovery: "Découverte"
    },
    social: {
      placeholder: "Partagez votre progression ou posez une question...",
      publish: "Publier",
      comments: "Commentaires",
      reply: "Répondre",
      like: "J'aime",
      no_posts: "Aucune publication pour le moment."
    },
    profile: {
      title: "Profil Pionnier",
      settings: "Paramètres",
      language: "Langue",
      notifications: "Notifications",
      sound: "Sons",
      support: "Support / FAQ",
      logout: "Déconnexion"
    },
    ads: {
      limit_reached: "⏳ Limite atteinte: Un retry sponsorisé toutes les 6h.\\nRevenez dans {{hours}}h.",
      no_ads: "🚫 Plus de publicités disponibles pour aujourd'hui. Revenez demain !",
      watch_confirm: "📺 PUBLICITÉ SPONSORISÉE\\n\\nRegardez une courte vidéo pour obtenir :\\n🎁 {{reward}}\\n\\nCela aide à payer les serveurs et garder l'app gratuite.\\nContinuer ?",
      reward_unlocked: "✅ Merci ! Récompense débloquée : {{reward}}"
    },
    rewards: {
      retry: "1 Retry Gratuit (80% des gains)",
      xp_bonus: "+{{amount}} XP Bonus",
      energy: "+{{amount}} Énergie",
      cooldown_skip: "Passer le temps d'attente",
      generic: "Récompense"
    },
    referral: {
      error_loading: "❌ Erreur lors du chargement des données de parrainage",
      rewards_claimed: "✅ Récompenses réclamées!\\n\\n+{{xp}} XP\\n+{{pi}}π",
      rewards_claimed_balance: "✅ Récompenses réclamées!\\n\\n+{{xp}} XP\\n+{{pi}}π\\n\\nNouveau solde:\\n{{newXp}} XP\\n{{newPi}}π",
      error_claiming: "❌ Erreur lors de la réclamation des récompenses",
      link_copied: "✅ Lien copié dans le presse-papier!",
      link_copy_error: "❌ Impossible de copier le lien",
      code_copied: "✅ Code copié!",
      code_copy_error: "❌ Impossible de copier le code"
    },
    shop: {
      insufficient_balance_detail: "⚠️ Solde insuffisant!\\n\\nCoût: {{cost}}π\\nVotre solde: {{balance}}π\\nManquant: {{missing}}π",
      confirm_purchase: "Confirmer l'achat?\\n\\n{{productName}}\\n{{productDesc}}\\n\\nCoût: {{cost}}π\\nSolde après achat: {{balance}}π",
      purchase_success: "✅ Achat réussi!\\n\\n{{productName}}{{extra}}",
      extra_energy: "\\n+{{amount}}⚡ ajouté",
      extra_boost: "\\n🚀 Régénération doublée pour 24h",
      extra_unlimited: "\\n♾️ Énergie illimitée activée pour 7 jours"
    }
  }
};

// 🇺🇸 English (Professional Native Translation)
const en = {
  translation: {
    common: {
      loading: "Loading...",
      submit: "Submit",
      cancel: "Cancel",
      close: "Close",
      save: "Save",
      delete: "Delete",
      confirm: "Confirm",
      next: "Next",
      back: "Back",
      finish: "Finish",
      error: "Error",
      success: "Success"
    },
    nav: {
      courses: "Courses",
      leaderboard: "Leaderboard",
      social: "Social",
      shop: "Shop",
      profile: "Profile"
    },
    stats: {
      level: "Level",
      xp: "Total XP",
      balance: "Balance",
      rank: "Rank",
      streak: "Streak",
      xpDetail: "XP / Next"
    },
    auth: {
      guest_mode: "Guest Mode - Progress not saved",
      login_pi: "Login with Pi Network"
    },
    course: {
      locked: "Locked",
      start: "Start Module",
      continue: "Resume",
      completed: "Completed",
      modules: "Module",
      time: "min",
      reward: "Reward",
      quiz: "Quiz",
      discovery: "Discovery"
    },
    social: {
      placeholder: "Share your progress or ask a question...",
      publish: "Post",
      comments: "Comments",
      reply: "Reply",
      like: "Like",
      no_posts: "No posts yet. Be the first to share!"
    },
    profile: {
      title: "Pioneer Profile",
      settings: "Settings",
      language: "Language",
      notifications: "Notifications",
      sound: "Sounds",
      support: "Support / FAQ",
      logout: "Logout"
    },
    ads: {
      limit_reached: "⏳ Limit reached: One sponsored retry every 6h.\\nCome back in {{hours}}h.",
      no_ads: "🚫 No more ads available today. Come back tomorrow!",
      watch_confirm: "📺 SPONSORED AD\\n\\nWatch a short video to get:\\n🎁 {{reward}}\\n\\nThis helps pay server costs and keep the app free.\\nContinue?",
      reward_unlocked: "✅ Thanks! Reward unlocked: {{reward}}"
    },
    rewards: {
      retry: "1 Free Retry (80% of gains)",
      xp_bonus: "+{{amount}} XP Bonus",
      energy: "+{{amount}} Energy",
      cooldown_skip: "Skip wait time",
      generic: "Reward"
    },
    referral: {
      error_loading: "❌ Error loading referral data",
      rewards_claimed: "✅ Rewards claimed!\\n\\n+{{xp}} XP\\n+{{pi}}π",
      rewards_claimed_balance: "✅ Rewards claimed!\\n\\n+{{xp}} XP\\n+{{pi}}π\\n\\nNew Balance:\\n{{newXp}} XP\\n{{newPi}}π",
      error_claiming: "❌ Error claiming rewards",
      link_copied: "✅ Link copied to clipboard!",
      link_copy_error: "❌ Unable to copy link",
      code_copied: "✅ Code copied!",
      code_copy_error: "❌ Unable to copy code"
    },
    shop: {
      insufficient_balance_detail: "⚠️ Insufficient Balance!\\n\\nCost: {{cost}}π\\nYour balance: {{balance}}π\\nMissing: {{missing}}π",
      confirm_purchase: "Confirm purchase?\\n\\n{{productName}}\\n{{productDesc}}\\n\\nCost: {{cost}}π\\nBalance after purchase: {{balance}}π",
      purchase_success: "✅ Purchase successful!\\n\\n{{productName}}{{extra}}",
      extra_energy: "\\n+{{amount}}⚡ added",
      extra_boost: "\\n🚀 Regeneration doubled for 24h",
      extra_unlimited: "\\n♾️ Unlimited Energy activated for 7 days"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      fr: fr
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // Persist language choice
    }
  });

export default i18n;
