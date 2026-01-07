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
    general: {
      connecting: "Connexion à Pi Network...",
      welcome: "Bienvenue",
      days: "jours",
      premium: "Premium",
      freeTier: "Gratuit",
      upgradePremium: "Passer Premium",
      staking: "Staking",
      month: "mois",
      subscribe: "S'abonner"
    },
    staking: {
       title: "Staking Pi",
       subtitle: "Gagnez des récompenses passives",
       available: "Disponible pour staking",
       staked: "En staking",
       earned: "Récompenses gagnées",
       start: "Commencer le Staking",
       unstake: "Retirer"
    },
    nav: {
      courses: "Cours",
      leaderboard: "Classement",
      social: "Social",
      shop: "Boutique",
      profile_tab: "Profil"
    },
    wallet: {
      title: "Mon Wallet Pi",
      total_balance: "Balance totale",
      connected: "Wallet connecté",
      prompt_withdraw: "Montant à retirer (Min: 0.001π):",
      withdraw: "Retirer",
      prompt_deposit: "Montant à déposer (π):",
      deposit: "Déposer"
    },
    leaderboard: {
      title: "Top Pioneers",
      subtitle: "Classement hebdomadaire des meilleurs apprenants"
    },
    premium: {
      banner_desc: "Débloquez tous les cours + Boost XP x2 + Frais 0%"
    },
    stats: {
      level: "Niveau",
      xp: "XP Total",
      balance: "Solde",
      rank: "Rang",
      streak: "Série",
      xpDetail: "XP / Suivant"
    },
    energy: {
      shop_title: "Boutique d'Énergie",
      shop_subtitle: "Rechargez votre énergie et boostez votre apprentissage",
      current: "Énergie Actuelle",
      price: "Prix",
      quick_refill: "Recharge Rapide",
      refill_desc: "Restaure instantanément 50⚡",
      popular: "Populaire",
      boost_24h: "Boost 24h",
      boost_desc: "Double la régénération pendant 24h (+20⚡/h)",
      best_value: "Meilleur Rapport",
      unlimited: "Énergie Illimitée",
      unlimited_desc: "Énergie infinie pendant 7 jours",
      natural_regen: "Régénération Naturelle",
      regen_info: "Votre énergie se régénère automatiquement à raison de +10⚡ par heure. Revenez après 12h d'absence pour un bonus de +20⚡!"
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
      no_posts: "Aucune publication pour le moment.",
      subtitle: "Apprenez et grandissez ensemble",
      refer_friends: "Parrainez vos amis",
      refer_desc: "Gagnez jusqu'à 200 XP et 0.001π par ami !",
      view_code: "Voir mon code",
      share_progress: "Partagez votre progression",
      post_placeholder: "Partagez vos réussites, posez des questions, aidez la communauté...",
      earn_xp_hint: "💡 Gagnez +10 XP par publication",
      delete_tooltip: "Supprimer la publication",
      comment_action: "Commenter",
      refer_title: "Parrainez vos amis!",
      refer_text: "Invitez vos amis à rejoindre Pioneer Academy et gagnez des récompenses",
      per_friend: "par ami",
      share_link: "📤 Partager mon lien"
    },
    profilePage: {
      title: "Profil Pionnier",
      settings: "Paramètres",
      language: "Langue",
      notifications: "Notifications",
      sound: "Sons",
      support: "Support / FAQ",
      logout: "Déconnexion",
      remove_pic: "Supprimer la photo",
      referral_code: "Code de Parrainage"
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
      code_copy_error: "❌ Impossible de copier le code",
      title: "Système de Parrainage",
      subtitle: "Invitez vos amis et gagnez des récompenses",
      your_code: "Votre Code de Parrainage",
      unique_code: "Code unique :",
      copy: "Copier",
      share_link: "Lien de partage :",
      share: "Partager",
      how_works_title: "Comment ça marche ?",
      how_works_desc: "Partagez votre code ou lien avec vos amis. Ils recevront +50 XP + 0.0001π à l'inscription, et vous gagnerez des récompenses quand ils progressent !",
      stats_total: "Total Filleuls",
      stats_active: "Filleuls Actifs",
      stats_xp: "XP Gagné",
      stats_pi: "Pi Gagné",
      pending_rewards: "Récompenses en Attente",
      claim_button: "Réclamer Maintenant",
      claiming: "Réclamation...",
      my_referrals: "Mes Filleuls",
      no_referrals: "Aucun filleul pour le moment",
      start_sharing: "Partagez votre code pour commencer !",
      milestones_title: "Paliers Collectifs",
      tiers: {
        five_active: "5 Filleuls Actifs",
        ten_active: "10 Filleuls Actifs",
        twentyfive_active: "25 Filleuls Actifs",
        fifty_active: "50 Filleuls Actifs",
        free_premium: "Premium Gratuit 1 mois",
        legendary_badge: "Badge Légendaire"
      }
    },
    shop: {
      insufficient_balance_detail: "⚠️ Solde insuffisant!\\n\\nCoût: {{cost}}π\\nVotre solde: {{balance}}π\\nManquant: {{missing}}π",
      confirm_purchase: "Confirmer l'achat?\\n\\n{{productName}}\\n{{productDesc}}\\n\\nCoût: {{cost}}π\\nSolde après achat: {{balance}}π",
      purchase_success: "✅ Achat réussi!\\n\\n{{productName}}{{extra}}",
      extra_energy: "\\n+{{amount}}⚡ ajouté",
      extra_boost: "\\n🚀 Régénération doublée pour 24h",
      extra_unlimited: "\\n♾️ Énergie illimitée activée pour 7 jours",
      items: {
        avatar_premium: "Avatar Premium",
        avatar_desc: "Démarquez-vous",
        badge_legendary: "Badge Légendaire",
        badge_desc: "Statut exclusif",
        boost_xp: "Boost XP x2",
        boost_desc: "24h de boost",
        pass_premium: "Pass Premium",
        pass_desc: "Accès illimité",
        pack_starter: "Pack Débutant",
        pack_desc: "Avatar + 2 Boosts + Badge"
      },
      subtitle: "Échangez vos Pi contre des items exclusifs",
      your_balance: "Votre balance",
      buy: "Acheter",
      insufficient: "Insuffisant",
      special_packs: "Packs Spéciaux"
    },
    badges: {
      guest: "Invité",
      guest_desc: "Accès limité - Connectez-vous avec Pi pour débloquer toutes les fonctionnalités",
      pioneer: "Pioneer",
      pioneer_desc: "Pioneer vérifié - Complétez votre KYC pour débloquer les fonctionnalités premium",
      pioneer_kyc: "Pioneer KYC",
      pioneer_kyc_desc: "Pioneer KYC vérifié - Accès complet à toutes les fonctionnalités",
      locked_feature: "🔒 Fonctionnalité Verrouillée",
      requires_status: "{{feature}} nécessite le statut",
      upgrade_guest: "Connectez-vous avec Pi Network pour accéder à cette fonctionnalité.",
      upgrade_kyc: "Complétez votre KYC pour débloquer cette fonctionnalité.",
      benefits_title: "Avantages du statut {{status}} :"
    },
    alerts: {
      premium_welcome: "🎉 Bienvenue Premium!\\n\\n✨ Avantages activés:\\n• Cours exclusifs déverrouillés\\n• Boost XP permanent x2\\n• Frais de retrait 0%\\n• Support prioritaire\\n• Badge Premium",
      invalid_amount: "⚠️ Montant invalide!\\n\\nVeuillez entrer un montant valide supérieur à 0.",
      insufficient_balance: "⚠️ Solde insuffisant!",
      staking_started: "✅ Staking démarré!\\n\\n💎 Montant: {{amount}}π\\n📅 Période: {{period}} jours\\n📈 APR: {{apr}}%\\n\\n⏰ Récompenses calculées automatiquement!",
      no_stake: "⚠️ Aucun Pi en staking!\\n\\nVous devez d'abord staker des Pi avant de pouvoir les retirer.",
      unstake_success: "✅ Unstake réussi!\\n\\n💰 Total récupéré: {{total}}π\\n📊 Principal: {{principal}}π\\n🎁 Récompenses: {{rewards}}π\\n\\n💡 Vous pouvez maintenant utiliser vos Pi!",
      empty_post: "⚠️ Veuillez écrire quelque chose!",
      post_shared: "✅ Publication partagée!\\n+10 XP gagné (Quota: {{count}}/3)",
      post_shared_limit: "✅ Publication partagée!\\n(Quota XP journalier atteint)",
      confirm_delete_post: "🗑️ Supprimer cette publication ?\\n\\nCette action est irréversible.",
      image_type_error: "⚠️ Veuillez sélectionner une image valide (JPG, PNG, GIF, etc.)",
      image_size_error: "⚠️ L'image est trop grande! Maximum 2MB.",
      profile_pic_updated: "✅ Photo de profil mise à jour!",
      profile_pic_removed: "✅ Photo de profil supprimée! Avatar emoji restauré.",
      copy_success: "✅ Lien copié dans le presse-papier !",
      copy_fail: "❌ Impossible de copier le lien. Veuillez le sélectionner et copier manuellement.",
      wallet_linked: "✅ Wallet lié et vérifié!\\n\\n+{{xp}} XP\\n+{{pi}}π",
      withdraw_success: "✅ Retrait effectué!\\n\\nMontant: {{amount}}π\\nFrais: {{fee}}π\\nNet: {{net}}π\\n\\n⏳ Traitement: 24-48h",
      deposit_success: "✅ Dépôt de {{amount}}π effectué!",
      sync_success: "✅ Synchronisation réussie!\\n{{count}} cours déverrouillés.",
      sync_already_uptodate: "Votre progression est déjà à jour.",
      kyc_required_staking: "⚠️ Staking réservé aux Pioneers vérifiés (KYC).",
      kyc_required_purchase: "⚠️ Accès refusé : KYC requise pour les achats.",
      pack_purchased: "🎉 Pack Débutant acheté!\\n\\nVous avez reçu:\\n• Avatar Premium 👑\\n• 2x Boost XP ⚡\\n• Badge Légendaire ⭐"
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
    general: {
      connecting: "Connecting to Pi Network...",
      welcome: "Welcome",
      days: "days",
      premium: "Premium",
      freeTier: "Free",
      upgradePremium: "Upgrade to Premium",
      staking: "Staking",
      month: "month",
      subscribe: "Subscribe"
    },
    staking: {
       title: "Pi Staking",
       subtitle: "Earn passive rewards",
       available: "Available to stake",
       staked: "Currently staked",
       earned: "Earned rewards",
       start: "Start Staking",
       unstake: "Unstake"
    },
    nav: {
      courses: "Courses",
      leaderboard: "Leaderboard",
      social: "Social",
      shop: "Shop",
      profile_tab: "Profile"
    },
    wallet: {
      title: "My Pi Wallet",
      total_balance: "Total Balance",
      connected: "Wallet Connected",
      prompt_withdraw: "Amount to withdraw (Min: 0.001π):",
      withdraw: "Withdraw",
      prompt_deposit: "Amount to deposit (π):",
      deposit: "Deposit"
    },
    leaderboard: {
      title: "Top Pioneers",
      subtitle: "Weekly leaderboard of top learners"
    },
    premium: {
      banner_desc: "Unlock all courses + 2x XP Boost + 0% Fees"
    },
    stats: {
      level: "Level",
      xp: "Total XP",
      balance: "Balance",
      rank: "Rank",
      streak: "Streak",
      xpDetail: "XP / Next"
    },
    energy: {
      shop_title: "Energy Shop",
      shop_subtitle: "Recharge your energy and boost your learning",
      current: "Current Energy",
      price: "Price",
      quick_refill: "Quick Refill",
      refill_desc: "Instantly restore 50⚡",
      popular: "Popular",
      boost_24h: "Boost 24h",
      boost_desc: "Double regen for 24h (+20⚡/h)",
      best_value: "Best Value",
      unlimited: "Unlimited Energy",
      unlimited_desc: "Infinite energy for 7 days",
      natural_regen: "Natural Regeneration",
      regen_info: "Your energy regenerates automatically at +10⚡ per hour. Come back after 12h for a +20⚡ bonus!"
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
      no_posts: "No posts yet. Be the first to share!",
      subtitle: "Learn and grow together",
      refer_friends: "Refer your friends",
      refer_desc: "Earn up to 200 XP and 0.001π per friend!",
      view_code: "View my code",
      share_progress: "Share your progress",
      post_placeholder: "Share your success, ask questions, help the community...",
      earn_xp_hint: "💡 Earn +10 XP per post",
      delete_tooltip: "Delete post",
      comment_action: "Comment",
      refer_title: "Refer your friends!",
      refer_text: "Invite friends to join Pioneer Academy and earn rewards",
      per_friend: "per friend",
      share_link: "📤 Share my link"
    },
    profilePage: {
      title: "Pioneer Profile",
      settings: "Settings",
      language: "Language",
      notifications: "Notifications",
      sound: "Sounds",
      support: "Support / FAQ",
      logout: "Logout",
      remove_pic: "Remove picture",
      referral_code: "Referral Code"
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
      code_copy_error: "❌ Unable to copy code",
      title: "Referral System",
      subtitle: "Invite friends and earn rewards",
      your_code: "Your Referral Code",
      unique_code: "Unique Code:",
      copy: "Copy",
      share_link: "Share Link:",
      share: "Share",
      how_works_title: "How it works?",
      how_works_desc: "Share your code or link with friends. They get +50 XP + 0.0001π on signup, and you earn rewards as they progress!",
      stats_total: "Total Referrals",
      stats_active: "Active Referrals",
      stats_xp: "XP Earned",
      stats_pi: "Pi Earned",
      pending_rewards: "Pending Rewards",
      claim_button: "Claim Now",
      claiming: "Claiming...",
      my_referrals: "My Referrals",
      no_referrals: "No referrals yet",
      start_sharing: "Share your code to start!",
      milestones_title: "Collective Milestones",
      tiers: {
        five_active: "5 Active Referrals",
        ten_active: "10 Active Referrals",
        twentyfive_active: "25 Active Referrals",
        fifty_active: "50 Active Referrals",
        free_premium: "Free Premium 1 Month",
        legendary_badge: "Legendary Badge"
      }
    },
    shop: {
      insufficient_balance_detail: "⚠️ Insufficient Balance!\\n\\nCost: {{cost}}π\\nYour balance: {{balance}}π\\nMissing: {{missing}}π",
      confirm_purchase: "Confirm purchase?\\n\\n{{productName}}\\n{{productDesc}}\\n\\nCost: {{cost}}π\\nBalance after purchase: {{balance}}π",
      purchase_success: "✅ Purchase successful!\\n\\n{{productName}}{{extra}}",
      extra_energy: "\\n+{{amount}}⚡ added",
      extra_boost: "\\n🚀 Regeneration doubled for 24h",
      extra_unlimited: "\\n♾️ Unlimited Energy activated for 7 days",
      items: {
        avatar_premium: "Premium Avatar",
        avatar_desc: "Stand out",
        badge_legendary: "Legendary Badge",
        badge_desc: "Exclusive status",
        boost_xp: "XP Boost x2",
        boost_desc: "24h boost",
        pass_premium: "Premium Pass",
        pass_desc: "Unlimited access",
        pack_starter: "Starter Pack",
        pack_desc: "Avatar + 2 Boosts + Badge"
      },
      subtitle: "Exchange your Pi for exclusive items",
      your_balance: "Your balance",
      buy: "Buy",
      insufficient: "Insufficient",
      special_packs: "Special Packs"
    },
    badges: {
      guest: "Guest",
      guest_desc: "Limited access - Login with Pi to unlock all features",
      pioneer: "Pioneer",
      pioneer_desc: "Verified Pioneer - Complete KYC to unlock premium features",
      pioneer_kyc: "KYC Pioneer",
      pioneer_kyc_desc: "Verified KYC Pioneer - Full access to all features",
      locked_feature: "🔒 Feature Locked",
      requires_status: "{{feature}} requires status",
      upgrade_guest: "Login with Pi Network to access this feature.",
      upgrade_kyc: "Complete your KYC to unlock this feature.",
      benefits_title: "Benefits of {{status}} status:"
    },
    alerts: {
      premium_welcome: "🎉 Welcome Premium!\\n\\n✨ Benefits activated:\\n• Exclusive courses unlocked\\n• Permanent 2x XP Boost\\n• 0% Withdrawal Fees\\n• Priority Support\\n• Premium Badge",
      invalid_amount: "⚠️ Invalid amount!\\n\\nPlease enter a valid amount greater than 0.",
      insufficient_balance: "⚠️ Insufficient Balance!",
      staking_started: "✅ Staking started!\\n\\n💎 Amount: {{amount}}π\\n📅 Period: {{period}} days\\n📈 APR: {{apr}}%\\n\\n⏰ Rewards calculated automatically!",
      no_stake: "⚠️ No Pi staked!\\n\\nYou must stake Pi before you can unstake.",
      unstake_success: "✅ Unstake successful!\\n\\n💰 Total retrieved: {{total}}π\\n📊 Principal: {{principal}}π\\n🎁 Rewards: {{rewards}}π\\n\\n💡 You can now use your Pi!",
      empty_post: "⚠️ Please write something!",
      post_shared: "✅ Post shared!\\n+10 XP earned (Quota: {{count}}/3)",
      post_shared_limit: "✅ Post shared!\\n(Daily XP quota reached)",
      confirm_delete_post: "🗑️ Delete this post?\\n\\nThis action cannot be undone.",
      image_type_error: "⚠️ Please select a valid image (JPG, PNG, GIF, etc.)",
      image_size_error: "⚠️ Image too large! Maximum 2MB.",
      profile_pic_updated: "✅ Profile picture updated!",
      profile_pic_removed: "✅ Profile picture removed! Emoji avatar restored.",
      copy_success: "✅ Link copied to clipboard!",
      copy_fail: "❌ Unable to copy link. Please select and copy manually.",
      wallet_linked: "✅ Wallet linked and verified!\\n\\n+{{xp}} XP\\n+{{pi}}π",
      withdraw_success: "✅ Withdrawal successful!\\n\\nAmount: {{amount}}π\\nFee: {{fee}}π\\nNet: {{net}}π\\n\\n⏳ Processing: 24-48h",
      deposit_success: "✅ Deposit of {{amount}}π successful!",
      sync_success: "✅ Sync successful!\\n{{count}} courses unlocked.",
      sync_already_uptodate: "Your progress is already up to date.",
      kyc_required_staking: "⚠️ Staking reserved for Verified Pioneers (KYC).",
      kyc_required_purchase: "⚠️ Access denied: KYC required for purchases.",
      pack_purchased: "🎉 Starter Pack purchased!\\n\\nYou received:\\n• Premium Avatar 👑\\n• 2x XP Boost ⚡\\n• Legendary Badge ⭐"
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
