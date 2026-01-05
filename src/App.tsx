/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import { Trophy, Book, Users, Star, Zap, Award, ChevronRight, Target, Brain, Shield, Gift, Flame, CheckCircle, Globe, Copy, Lock, Crown, Share2, TrendingUp, DollarSign, Calendar, Percent, AlertCircle, X, Trash2, Wallet } from 'lucide-react';
import { saveUserProfile, getUserProfile } from './services/firebase';
import { COURSES } from './data/courses';
import { EnergySystem } from './services/edu/EnergySystem';
import { AccessControl } from './services/edu/AccessControl';
import { QuestionEngine } from './services/edu/QuestionEngine';
import { DynamicQuestionEngine } from './services/edu/DynamicQuestionEngine';
import { LayerSelector } from './components/education/LayerSelector';
import { EnergyDisplay } from './components/education/EnergyDisplay';
import { EnergyHeader } from './components/energy/EnergyHeader';
import { EnergyShop } from './components/energy/EnergyShop';
import { UserBadge, UserStatus } from './components/user/UserBadge';
import { CommentThread, Comment } from './components/social/CommentThread';
import { UserAccessControl } from './services/UserAccessControl';
import { Layer, QuizQuestion } from './types';
import { DiscoveryViewer } from './components/education/DiscoveryViewer';
import { enrichDiscoveryLayer } from './data/discoveryContent';
import ProgressionSystem from './services/ProgressionSystem';
import { CourseCard } from './components/education/CourseCard';
import { DecisionLab, DecisionScenario } from './components/education/DecisionLab';
import { DECISION_SCENARIOS } from './data/decisionScenarios';
import { CoursesTab } from './components/education/CoursesTab';
import { QuestionRandomizer } from './services/QuestionRandomizer';
import { CooldownManager } from './services/CooldownManager';
import { QuizResults } from './components/education/QuizResults';
import RetrySystem, { RetryHistory } from './services/RetrySystem';
import { ReferralDashboard } from './components/referral/ReferralDashboard';
import { PiWalletLink } from './components/referral/PiWalletLink';
import { AdManager } from './services/AdManager'; // 📺 AdManager
import { logMessage, logEvent } from './services/monitoring'; // 📊 Monitoring

// i18n Imports
import { useTranslation } from 'react-i18next';
import './i18n'; // Initialize i18n config
import { getCourses } from './data/courses'; // New dynamic loader

// Translations
const translations = {
  en: {
    connecting: "Connecting to Pi Network...",
    welcome: "Welcome",
    balance: "Balance",
    level: "Level",
    streak: "Streak",
    days: "days",
    courses: "Courses",
    leaderboard: "Leaderboard",
    social: "Social",
    shop: "Shop",
    staking: "Staking",
    profile: "Profile",
    premium: "Premium",
    freeTier: "Free",
    upgradePremium: "Upgrade to Premium",
    stakingTitle: "Pi Staking",
    stakingSubtitle: "Earn passive rewards",
    availableToStake: "Available to stake",
    currentlyStaked: "Currently staked",
    earnedRewards: "Earned rewards",
    startStaking: "Start Staking",
    unstake: "Unstake",
    month: "month",
    subscribe: "Subscribe"
  },
  fr: {
    connecting: "Connexion à Pi Network...",
    welcome: "Bienvenue",
    balance: "Solde",
    level: "Niveau",
    streak: "Série",
    days: "jours",
    courses: "Cours",
    leaderboard: "Classement",
    social: "Social",
    shop: "Boutique",
    staking: "Staking",
    profile: "Profil",
    premium: "Premium",
    freeTier: "Gratuit",
    upgradePremium: "Passer Premium",
    stakingTitle: "Staking Pi",
    stakingSubtitle: "Gagnez des récompenses passives",
    availableToStake: "Disponible pour staking",
    currentlyStaked: "En staking",
    earnedRewards: "Récompenses gagnées",
    startStaking: "Commencer le Staking",
    unstake: "Retirer",
    month: "mois",
    subscribe: "S'abonner"
  }
};


const PI_GCV = 314.159;
declare const Pi: any;

// 🎯 Fonction utilitaire pour calculer le niveau et XP restants
// Évite la duplication de logique et garantit la cohérence
const calculateLevelFromXP = (totalXP: number): { level: number; xpToNext: number } => {
  const level = Math.floor(totalXP / 100) + 1;
  const xpToNext = (level * 100) - totalXP;
  return { level, xpToNext };
};

const App = () => {
  // 🌍 i18n Hook - MUST BE FIRST to avoid ReferenceError
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState<any>(null);
  // Auth States: 'initial' | 'loading' | 'pioneer' | 'guest'
  const [authStatus, setAuthStatus] = useState<string>('initial');
  // KYC States: 'none' | 'pending' | 'verified'
  const [kycStatus, setKycStatus] = useState<string>('none');
  const [loading, setLoading] = useState(false); // Used for async ops within screens 
  const [authError, setAuthError] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [language, setLanguage] = useState(i18n.language?.startsWith('en') ? 'en' : 'fr'); // Sync with i18n detection
  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
    i18n.changeLanguage(newLang); // Switch i18n instance
  };
  const [showProfile, setShowProfile] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showStaking, setShowStaking] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [postContent, setPostContent] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showEnergyShop, setShowEnergyShop] = useState(false);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set()); // Track which posts have comments expanded
  const [showDiscovery, setShowDiscovery] = useState(false); // Track Discovery viewer
  const [showDecisionLab, setShowDecisionLab] = useState(false); // Track Decision Lab
  const [currentScenario, setCurrentScenario] = useState<DecisionScenario | null>(null); // Current decision scenario
  const [randomizedQuestions, setRandomizedQuestions] = useState<QuizQuestion[]>([]); // Randomized questions for current quiz
  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([]); // Track recent questions to avoid repetition
  const [showQuizResults, setShowQuizResults] = useState(false); // Track quiz results screen
  const [quizResultsData, setQuizResultsData] = useState<any>(null); // Store quiz results data
  const [showReferralDashboard, setShowReferralDashboard] = useState(false); // Track referral dashboard
  const [hasWatchedAdForRetry, setHasWatchedAdForRetry] = useState(false); // 📺 Track if user watched ad for retry
  const [quizSponsoredByAd, setQuizSponsoredByAd] = useState(false); // 📺 Track if CURRENT quiz session is sponsored by ad



  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

  const [userProgress, setUserProgress] = useState<any>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    streak: 0,
    piBalance: 0.0000,
    completedCourses: [],
    completedLayers: {}, 
    layerMastery: {}, 
    questionHistory: {},
    energy: EnergySystem.getInitialState(),
    reputation: { total: 100, constancy: 0, progression: 0, precision: 0 },
    totalPoints: 0,
    referralCode: 'PIA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    lastLoginDate: null,
    stakingBalance: 0,
    stakingRewards: 0,
    stakingStartDate: null,
    stakingPeriod: null,
    retryHistory: {} as RetryHistory,
    dailyPostCount: 0, 
    lastPostDate: null
  });

  // 📚 Course State (Dynamic based on language)
  const [courses, setCourses] = useState<any[]>([]);

  // Effect: Update courses when language changes
  useEffect(() => {
     const loadedCourses = getCourses(language);
     setCourses(loadedCourses);
  }, [language]); // Re-run whenever language toggle changes



  const quizQuestions = {
    1: [
      {
        question: "Qu'est-ce que Pi Network?",
        options: [
          "Une cryptomonnaie minée sur smartphone",
          "Un réseau social traditionnel",
          "Une plateforme de jeux vidéo",
          "Un système bancaire classique"
        ],
        correct: 0,
        explanation: "Pi Network est une cryptomonnaie innovante qui permet le minage sur smartphone sans consommer de batterie, rendant la crypto accessible à tous."
      },
      {
        question: "Quel est le GCV (General Consensus Value) de Pi?",
        options: ["$100", "$314.159", "$1000", "$50"],
        correct: 1,
        explanation: "Le GCV de Pi est fixé à $314.159, une référence au nombre π (pi), symbolisant l'identité mathématique du projet."
      },
      {
        question: "Qui peut miner du Pi?",
        options: [
          "Seulement les experts",
          "Tout le monde avec un smartphone",
          "Seulement avec du matériel ASIC",
          "Personne"
        ],
        correct: 1,
        explanation: "Pi Network démocratise le minage crypto en permettant à quiconque possède un smartphone de participer, sans équipement coûteux."
      }
    ],
    2: [
      {
        question: "Qu'est-ce qu'une blockchain?",
        options: [
          "Une chaîne physique",
          "Un registre distribué et immuable",
          "Un type de cryptographie",
          "Un réseau social"
        ],
        correct: 1,
        explanation: "La blockchain est un registre distribué qui enregistre les transactions de manière sécurisée et transparente, sans autorité centrale."
      },
      {
        question: "Que signifie 'décentralisé'?",
        options: [
          "Contrôlé par une seule entité",
          "Distribué sur plusieurs nœuds",
          "Stocké dans le cloud",
          "Géré par des banques"
        ],
        correct: 1,
        explanation: "La décentralisation signifie que le réseau est distribué sur plusieurs nœuds indépendants, éliminant les points de défaillance uniques."
      }
    ],
    3: [
      {
        question: "Qu'est-ce qu'un wallet sécurisé?",
        options: [
          "Un portefeuille physique",
          "Un coffre-fort numérique pour crypto",
          "Un compte bancaire",
          "Une application mobile"
        ],
        correct: 1,
        explanation: "Un wallet crypto est un coffre-fort numérique qui stocke vos clés privées de manière sécurisée, vous donnant le contrôle total de vos actifs."
      }
    ],
    4: [ // Pi Wallet
       {
         question: "Quelle est la clé qui permet d'accéder à vos Pi?",
         options: ["La clé publique", "La Passphrase (24 mots)", "Le nom d'utilisateur", "L'adresse email"],
         correct: 1,
         explanation: "Votre Passphrase est la SEULE façon d'accéder à votre wallet. Ne la partagez jamais avec personne, même pas la Core Team."
       },
       {
         question: "Votre adresse de wallet (clé publique) commence par quelle lettre?",
         options: ["P", "G", "W", "0x"],
         correct: 1,
         explanation: "Les adresses de wallet Pi sur le Mainnet commencent généralement par 'G' (comme sur Stellar)."
       },
       {
         question: "Quelle est la différence entre Testnet et Mainnet?",
         options: ["Aucune", "Testnet utilise de faux Pi pour tester, Mainnet utilise de vrais Pi", "Testnet est plus rapide", "Mainnet est gratuit"],
         correct: 1,
         explanation: "Le Testnet sert à tester les applications sans risque financier, tandis que le Mainnet est le réseau réel avec une valeur économique."
       }
    ],
    5: [ // KYC
      {
        question: "Pourquoi le KYC est-il nécessaire pour Pi?",
        options: ["Pour vendre vos données", "Pour assurer 1 personne = 1 compte", "C'est facultatif", "Pour payer des impôts"],
        correct: 1,
        explanation: "Le KYC (Know Your Customer) garantit l'intégrité du réseau en empêchant les faux comptes et les bots."
      },
      {
        question: "Combien de temps faut-il pour migrer après le KYC?",
        options: ["Immédiatement", "14 jours (Période d'attente)", "1 an", "Jamais"],
        correct: 1,
        explanation: "Après avoir passé le KYC et signé l'accusé de réception, il y a une période d'attente de 14 jours avant que le solde ne soit migré."
       },
       {
         question: "Qu'est-ce que le 'Liveness Check' durant le KYC?",
         options: ["Vérifier si vous respirez", "Un selfie vidéo pour prouver que vous êtes un humain vivant", "Une analyse sanguine", "Un test de QI"],
         correct: 1,
         explanation: "Le Liveness Check est une courte vidéo selfie demandée par l'algorithme pour confirmer que vous êtes une personne réelle et non une photo statique."
       }
    ],
    6: [ // Scams
      {
        question: "Quelqu'un vous demande votre Passphrase pour 'vérifier' votre wallet. Que faites-vous?",
        options: ["Je la donne", "Je la donne seulement si c'est un admin", "Je ne la donne JAMAIS (Bloquer & Signaler)", "Je demande pourquoi"],
        correct: 2,
        explanation: "Aucun admin officiel ne vous demandera jamais votre Passphrase. C'est toujours une arnaque."
      },
      {
        question: "Un site web promet d'échanger vos Pi en $ maintenant. Est-ce sûr?",
        options: ["Oui, c'est une opportunité", "Non, le Pi est en Enclosed Mainnet (échanges fiat interdits)", "Peut-être", "Seulement si le site est beau"],
        correct: 1,
        explanation: "Durant l'Enclosed Mainnet, l'échange de Pi contre de la monnaie fiat est interdit et est souvent le signe d'une arnaque."
      },
      {
        question: "Comment identifier un faux compte 'Pi Support' sur les réseaux sociaux?",
        options: ["Il a le logo Pi", "Il vous contacte en premier par DM pour 'aider'", "Il publie des news", "Il a beaucoup d'abonnés"],
        correct: 1,
        explanation: `Le ${t('profile.support')} officiel de Pi ne vous contactera JAMAIS en premier par message privé (DM) pour résoudre un problème de compte.`
      }
    ]
  };

  const onIncompletePaymentFound = (payment: any) => {
      console.log("Incomplete payment found", payment);
      // return Pi.createPayment({...}, ...) // callback logic
  };

  // Main Auth Function triggered by "Connect with Pi" button
  const handlePiLogin = async () => {
      try {
        setLoading(true);

        // DEV BACKDOOR: Simulate Pioneer on Localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
           // eslint-disable-next-line no-restricted-globals
           const isDev = confirm("⚡ Mode Développement détecté !\nVoulez-vous simuler une connexion Pioneer vérifiée ?");
           if (isDev) {
               console.log("Simulating Pioneer Login...");
               setKycStatus('verified');
               setUser({
                   uid: 'DEV_PIONEER_' + Math.floor(Math.random() * 1000),
                   username: 'Dev_Pioneer',
                   accessToken: 'im_a_fake_token',
                   avatar: '👨‍💻',
                   joinDate: new Date().toISOString().split('T')[0]
               });
               setAuthStatus('pioneer');
               setLoading(false);
               return; 
           }
        }

        // @ts-ignore
        if (typeof Pi !== 'undefined') {
            await Pi.init({ version: "2.0", sandbox: true });
            const scopes = ['username', 'payments'];
            const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
            
            // Mock KYC Check (In real app, fetch from backend)
            // For now, assume Real Pi Auth = Verified (simulated)
            setKycStatus('verified'); 

            setUser({
              uid: auth.user.uid,
              username: auth.user.username,
              accessToken: auth.accessToken,
              avatar: '👤',
              joinDate: new Date().toISOString().split('T')[0]
            });

            // Load Data
            const savedData = await getUserProfile(auth.user.uid);
            if (savedData) {
              // 🐛 FIX: Recalculer le niveau au chargement pour éviter les incohérences
              const loadedProgress = savedData.userProgress || userProgress;
              const { level, xpToNext } = calculateLevelFromXP(loadedProgress.xp || 0);
              setUserProgress({
                ...loadedProgress,
                level,  // Niveau recalculé depuis les XP
                xpToNext
              });
              setIsPremium(savedData.isPremium || false);
              setSocialPosts(savedData.socialPosts || []);
              setProfilePicture(savedData.profilePicture || null);
            }
            
            setAuthStatus('pioneer');
        } else {
             alert("Pi Browser introuvable. Veuillez ouvrir l'app dans Pi Browser.");
             setLoading(false);
        }
      } catch (err) {
        console.error("Pi Auth Error", err);
        setAuthError(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
  };

  const handleLogout = () => {
    // Simplified logout for better UX/Reliability
    // if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) { // Optional: Remove confirm for faster interaction
      console.log("Logging out...");
      setUser(null);
      setAuthStatus('initial');
      setKycStatus('none');
      setQuizActive(false);
      setShowCourseDetail(false);
      setShowProfile(false);
    // }
  };

  const handleGuestLogin = () => {
      console.warn("Guest Mode Activated.");
      const uid = 'GUEST_' + Math.floor(Math.random() * 1000);
      setUser({
          uid: uid,
          username: 'Guest_Pioneer',
          avatar: '🕵️',
          joinDate: new Date().toISOString().split('T')[0]
      });
      setKycStatus('none');
      setAuthStatus('guest');
  };



  useEffect(() => {
    if (user) {
      // Calculate staking rewards
      if (userProgress.stakingBalance > 0 && userProgress.stakingStartDate) {
        const now = Date.now();
        const elapsed = now - userProgress.stakingStartDate;
        const daysElapsed = elapsed / (1000 * 60 * 60 * 24);

        let apr = 0.05; // 5% base
        if (userProgress.stakingPeriod === 60) apr = 0.08; // 8% for 60 days
        if (userProgress.stakingPeriod === 90) apr = 0.12; // 12% for 90 days

        const rewards = (userProgress.stakingBalance * apr * daysElapsed) / 365;

        setUserProgress((prev: any) => ({
          ...prev,
          stakingRewards: rewards
        }));
      }

      // Save to Cloud (Firebase) with debounce or direct
      const timeoutId = setTimeout(() => {
        saveData();
      }, 1000); // Debounce save to avoid too many writes
      
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProgress, isPremium, user]);

  // Energy recharge timer - update energy display every 6 minutes
  useEffect(() => {
    if (user) {
      const energyInterval = setInterval(() => {
        setUserProgress((prev: any) => ({
          ...prev,
          energy: EnergySystem.calculateCurrentEnergy(prev.energy)
        }));
      }, 6 * 60 * 1000); // 6 minutes = time to recharge 1 energy point

      return () => clearInterval(energyInterval);
    }
  }, [user]);

  // 🔒 Lock Body Scroll when any modal is open (Fix Mobile Scroll Issues)
  // 🔓 OPTIMIZATION: Removed aggressive Body Scroll Lock which caused UI jumps on mobile devices.
  // Instead, we rely on the modal's z-index and overlay to handle scrolling natively.

  const saveData = async () => {
    if (user) {
      await saveUserProfile(user.uid, {
        userProgress,
        isPremium,
        socialPosts,
        profilePicture
      });
    }
  };

  const handlePremiumUpgrade = () => {
    const PREMIUM_COST = 0.01;

    if (userProgress.piBalance < PREMIUM_COST) {
      alert(`⚠️ Solde insuffisant!\n\nCoût Premium: ${PREMIUM_COST}π\nVotre balance: ${userProgress.piBalance.toFixed(6)}π`);
      return;
    }

    setUserProgress((prev: any) => ({
      ...prev,
      piBalance: prev.piBalance - PREMIUM_COST
    }));

    setIsPremium(true);
    setShowPremiumModal(false);

    alert('🎉 Bienvenue Premium!\n\n✨ Avantages activés:\n• Cours exclusifs déverrouillés\n• Boost XP permanent x2\n• Frais de retrait 0%\n• Support prioritaire\n• Badge Premium');
  };

  const handleStaking = (amount: number, period: number) => {
    // Round to 6 decimal places to avoid floating point precision issues
    const roundedAmount = Math.round(amount * 1000000) / 1000000;
    const roundedBalance = Math.round(userProgress.piBalance * 1000000) / 1000000;
    
    if (isNaN(roundedAmount) || roundedAmount <= 0) {
      alert('⚠️ Montant invalide!\n\nVeuillez entrer un montant valide supérieur à 0.');
      return;
    }
    
    if (roundedAmount > roundedBalance) {
      alert(`⚠️ Solde insuffisant!\n\nMontant demandé: ${roundedAmount.toFixed(6)}π\nVotre balance: ${roundedBalance.toFixed(6)}π\nManquant: ${(roundedAmount - roundedBalance).toFixed(6)}π`);
      return;
    }

    setUserProgress((prev: any) => ({
      ...prev,
      piBalance: Math.round((prev.piBalance - roundedAmount) * 1000000) / 1000000,
      stakingBalance: Math.round((prev.stakingBalance + roundedAmount) * 1000000) / 1000000,
      stakingStartDate: Date.now(),
      stakingPeriod: period
    }));

    alert(`✅ Staking démarré!\n\n💎 Montant: ${roundedAmount.toFixed(6)}π\n📅 Période: ${period} jours\n📈 APR: ${period === 30 ? '5%' : period === 60 ? '8%' : '12%'}\n\n⏰ Récompenses calculées automatiquement!`);
    setShowStaking(false);
  };

  const handleUnstake = () => {
    if (userProgress.stakingBalance === 0) {
      alert('⚠️ Aucun Pi en staking!\n\nVous devez d\'abord staker des Pi avant de pouvoir les retirer.');
      return;
    }

    // Round to 6 decimal places to avoid floating point precision issues
    const roundedStaking = Math.round(userProgress.stakingBalance * 1000000) / 1000000;
    const roundedRewards = Math.round(userProgress.stakingRewards * 1000000) / 1000000;
    const total = Math.round((roundedStaking + roundedRewards) * 1000000) / 1000000;

    setUserProgress((prev: any) => ({
      ...prev,
      piBalance: Math.round((prev.piBalance + total) * 1000000) / 1000000,
      stakingBalance: 0,
      stakingRewards: 0,
      stakingStartDate: null,
      stakingPeriod: null
    }));

    alert(`✅ Unstake réussi!\n\n💰 Total récupéré: ${total.toFixed(6)}π\n📊 Principal: ${roundedStaking.toFixed(6)}π\n🎁 Récompenses: ${roundedRewards.toFixed(6)}π\n\n💡 Vous pouvez maintenant utiliser vos Pi!`);
    setShowStaking(false);
  };

  const handlePublish = () => {
    if (!postContent.trim()) {
      alert('⚠️ Veuillez écrire quelque chose!');
      return;
    }

    const today = new Date().toDateString();
    
    // Check Daily Limit for XP
    if (userProgress.lastPostDate !== today) {
        // New day, reset count
        setUserProgress((prev: any) => ({ ...prev, dailyPostCount: 0, lastPostDate: today }));
    }

    const newPost = {
      id: Date.now(),
      userId: user?.uid, // Track post owner
      user: user?.username,
      avatar: user?.avatar,
      profilePicture: profilePicture, // 📸 Save real profile picture!
      time: 'À l\'instant',
      content: postContent,
      likes: 0,
      comments: [],
      timestamp: Date.now()
    };

    setSocialPosts([newPost, ...socialPosts]);
    
    // 🐛 FIX: XP Limit (Max 3 posts/day)
    if ((userProgress.dailyPostCount || 0) < 3) {
        setUserProgress((prev: any) => {
          const newXP = prev.xp + 10;
          const { level, xpToNext } = calculateLevelFromXP(newXP);
          return { 
              ...prev, 
              xp: newXP, 
              level, 
              xpToNext, 
              totalPoints: prev.totalPoints + 10,
              dailyPostCount: (prev.dailyPostCount || 0) + 1,
              lastPostDate: today
          };
        });
        alert('✅ Publication partagée!\n+10 XP gagné (Quota: ' + ((userProgress.dailyPostCount || 0) + 1) + '/3)');
    } else {
        alert('✅ Publication partagée!\n(Quota XP journalier atteint)');
    }
    
    setPostContent('');
  };

  const handleAddComment = (postId: string, content: string, parentId: string | null) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random()}`,
      postId: postId,
      userId: user?.uid || '',
      username: user?.username || 'Anonymous',
      avatar: user?.avatar || '👤',
      // Store profile pic in comment if needed (requires updating Comment interface, for now consistent with avatar)
      content: content,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      parentId: parentId
    };


    setPostComments((prev: Record<string, Comment[]>) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    // Auto-expand the post to show the new comment
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });

    // 🐛 FIX: Recalculer le niveau quand on gagne des XP
    setUserProgress((prev: any) => {
      const newXP = prev.xp + 5;
      const { level, xpToNext } = calculateLevelFromXP(newXP);
      return { ...prev, xp: newXP, level, xpToNext, totalPoints: prev.totalPoints + 5 };
    });
  };

  const handleLikeComment = (commentId: string) => {
    setPostComments(prev => {
      const updated: Record<string, Comment[]> = { ...prev };
      Object.keys(updated).forEach((postId: string) => {
        updated[postId] = updated[postId].map((comment: Comment) => {
          if (comment.id === commentId) {
            const isLiked = comment.likedBy.includes(user?.uid || '');
            return {
              ...comment,
              likes: isLiked ? comment.likes - 1 : comment.likes + 1,
              likedBy: isLiked 
                ? comment.likedBy.filter((id: string) => id !== user?.uid)
                : [...comment.likedBy, user?.uid || '']
            };
          }
          return comment;
        });
      });
      return updated;
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setPostComments(prev => {
      const updated: Record<string, Comment[]> = { ...prev };
      Object.keys(updated).forEach((postId: string) => {
        updated[postId] = updated[postId].filter((comment: Comment) => comment.id !== commentId);
      });
      return updated;
    });
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm('🗑️ Supprimer cette publication ?\n\nCette action est irréversible.')) {
      setSocialPosts(prev => prev.filter(post => post.id !== postId));
      // Also remove all comments associated with this post
      setPostComments(prev => {
        const updated = { ...prev };
        delete updated[String(postId)];
        return updated;
      });
      // Remove from expanded posts
      setExpandedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(String(postId));
        return newSet;
      });
    }
  };

  const handleEnergyPurchase = (productId: string, cost: number, energyGain: number) => {
    // Deduct Pi with proper rounding to avoid floating point precision issues
    setUserProgress((prev: any) => ({
      ...prev,
      piBalance: Math.round((prev.piBalance - cost) * 1000000) / 1000000,
      energy: {
        ...prev.energy,
        current: Math.min(prev.energy.max + energyGain, prev.energy.max + energyGain),
        max: productId.includes('unlimited') ? 999999 : prev.energy.max
      }
    }));
  };

  const handleProfilePictureUpload = (event: any) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Veuillez sélectionner une image valide (JPG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('⚠️ L\'image est trop grande! Maximum 2MB.');
      return;
    }

    // Convert to base64 for localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
      alert('✅ Photo de profil mise à jour!');
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    alert('✅ Photo de profil supprimée! Avatar emoji restauré.');
  };

  const startCourse = (course: any) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
    setSelectedLayer(null); // Reset layer selection
  };
  
  const handleSelectLayer = (layer: Layer) => {
    // Check if user has enough energy
    if (!EnergySystem.hasEnoughEnergy(userProgress.energy, layer.energyCost)) {
      const freshEnergy = EnergySystem.calculateCurrentEnergy(userProgress.energy);
      alert(`⚠️ Énergie insuffisante!\n\nÉnergie requise: ${layer.energyCost}⚡\nÉnergie actuelle: ${freshEnergy.current}⚡\n\n💡 Attendez la recharge ou achetez de l'énergie dans la boutique.`);
      return;
    }

    // Consume energy
    const newEnergyState = EnergySystem.consumeUnsafe(userProgress.energy, layer.energyCost);
    
    if (layer.type === 'discovery') {
       // Enrich layer with varied, engaging content
       const enrichedContent = enrichDiscoveryLayer(layer.id);
       const enrichedLayer = enrichedContent 
         ? { ...layer, discoveryContent: enrichedContent }
         : layer;
       
       // Show Discovery Viewer with rich interactive content
       setSelectedLayer(enrichedLayer);
       setShowDiscovery(true);
       setShowCourseDetail(false); // Hide layer selector while viewing discovery
    } else if (layer.type === 'comprehension' || layer.type === 'application') {
        // Update energy state before starting quiz
        setUserProgress((prev: any) => ({
            ...prev,
            energy: newEnergyState
        }));
        
        // Start Quiz
        setSelectedLayer(layer);
        startQuiz(layer);
    }
  };

  const startQuiz = (layer: Layer, sponsored: boolean = false) => {
    setShowCourseDetail(false); // Hide layer selector
    setQuizActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    
    // 🎯 NOUVEAU: Utiliser QuestionRandomizer avec la banque enrichie de 80 questions!
    const allQuestions = layer.questions || [];
    
    // Randomiser vraiment les questions en évitant les récentes
    const randomized = QuestionRandomizer.selectAvoidingRecent(
      allQuestions,
      recentQuestionIds,
      3 // 3 questions par quiz
    );
    
    // Tracker les questions récentes pour éviter répétition
    const questionIds = randomized.map(q => q.id);
    setRecentQuestionIds(prev => {
      // Garder seulement les 6 derniers IDs
      const updated = [...questionIds, ...prev].slice(0, 6);
      return updated;
    });
    
    console.log(`🎯 Quiz démarré: ${randomized.length} questions randomisées`);
    console.log(`📚 Layer: ${layer.title}`);
    console.log(`🎲 Questions sélectionnées:`, randomized.map(q => q.id));
    console.log(`📝 Questions récentes évitées:`, recentQuestionIds.slice(0, 3));
    
    // ✅ Stocker les questions randomisées
    setRandomizedQuestions(randomized);

    // ✅ Mettre à jour selectedLayer
    setSelectedLayer({
      ...layer,
      questions: randomized
    });

    // 3. Reset Ad state for new quiz & Set Session State
    setHasWatchedAdForRetry(false);
    setQuizSponsoredByAd(sponsored);
  };

  const handleAnswer = (answerIndex: number) => {
    // ✅ Utiliser les questions randomisées du quiz actuel
    const questions = randomizedQuestions.length > 0 ? randomizedQuestions : (selectedLayer?.questions || []).slice(0, 3);
    
    if (questions.length === 0) {
      console.error('❌ Aucune question disponible');
      return;
    }
    
    const isCorrect = answerIndex === questions[currentQuestion].correct;

    // 🐛 FIX: Stocker l'index de la réponse sélectionnée au lieu du booléen isCorrect
    // pour permettre à QuizResults de calculer les statistiques par difficulté
    setAnswers([...answers, { question: currentQuestion, selected: answerIndex }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      setTimeout(() => {
        completeQuiz();
      }, 1000);
    }
  };

  const completeQuiz = () => {
    // ✅ Utiliser les questions randomisées du quiz actuel
    const questions = randomizedQuestions.length > 0 ? randomizedQuestions : (selectedLayer?.questions || []).slice(0, 3);
    const percentage = (score / questions.length) * 100;

    // 🔁 RETRY SYSTEM: Obtenir les informations de retry pour ce layer
    const retryInfo = RetrySystem.getRetryInfo(
      selectedLayer?.id || '',
      userProgress.retryHistory || {},
      userProgress.xp,
      isPremium,
      quizSponsoredByAd, // 📺 Passer le flag de session
      AdManager.isRewardAvailable('RETRY') // ⏳ Dispo globale
    );

    const xpMultiplier = isPremium ? 2 : 1;
    // 🐛 FIX: Utiliser selectedLayer.xpReward au lieu de selectedCourse.xp (qui n'existe pas!)
    const baseXP = selectedLayer?.xpReward || 100; // Fallback à 100 si undefined
    const basePi = percentage >= 80 ? selectedCourse.piReward : (selectedCourse.piReward * percentage) / 100;
    
    // 🔁 Appliquer le multiplicateur de retry aux récompenses
    const { adjustedXP: preMultiplierXP, adjustedPi: earnedPi } = RetrySystem.calculateAdjustedRewards(
      Math.floor((baseXP * percentage) / 100),
      basePi,
      retryInfo.rewardMultiplier
    );
    
    // Appliquer le multiplicateur Premium APRÈS le multiplicateur de retry
    const earnedXP = preMultiplierXP * xpMultiplier;

    const newXP = userProgress.xp + earnedXP;
    // 🐛 FIX: Utiliser la fonction utilitaire pour calculer le niveau
    const { level: newLevel, xpToNext: newXPToNext } = calculateLevelFromXP(newXP);

    // ⏱️ Démarrer/mettre à jour le cooldown pour ce layer
    // RÈGLE: 3 essais gratuits, cooldown au 4ème
    const existingCooldown = userProgress.layerCooldowns?.[selectedLayer?.id || ''];
    const layerCooldown = CooldownManager.startCooldown(
      selectedLayer?.id || '',
      selectedLayer?.cooldownMinutes || 15, // 15 min par défaut
      existingCooldown // Passer l'existant pour tracking attempts
    );

    setUserProgress((prev: any) => {
      // 🎯 CRITIQUE: Marquer le layer comme complété si score >= 80%
      const currentComplete = prev.completedLayers[selectedCourse.id] || [];
      const shouldMarkComplete = percentage >= 80 && !currentComplete.includes(selectedLayer?.id || '');
      
      // 🔁 Enregistrer cette tentative dans l'historique de retry
      // 📊 Déterminer la source du retry
      let retrySource: 'XP' | 'AD' | 'PREMIUM' = 'XP';
      if (isPremium) retrySource = 'PREMIUM';
      else if (quizSponsoredByAd) retrySource = 'AD';

      // 📋 Log pour analyse
      logEvent('retry_finished', {
          layerId: selectedLayer?.id,
          score: percentage,
          earnedXP,
          retry_source: retrySource
      });

      const updatedRetryHistory = RetrySystem.recordRetry(
        selectedLayer?.id || '',
        prev.retryHistory || {},
        score,
        earnedXP,
        earnedPi,
        retrySource
      );
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: newXPToNext, // XP restants pour prochain niveau (pré-calculé)
        piBalance: prev.piBalance + earnedPi,
        totalPoints: prev.totalPoints + earnedXP,
        // 🎯 Mettre à jour completedLayers pour progression des cours
        completedLayers: shouldMarkComplete ? {
          ...prev.completedLayers,
          [selectedCourse.id]: [...currentComplete, selectedLayer?.id || '']
        } : prev.completedLayers,
        // Mettre à jour completedCourses si TOUTES les layers du cours sont complétées
        completedCourses: percentage >= 80 && !prev.completedCourses.includes(selectedCourse.id)
          ? [...prev.completedCourses, selectedCourse.id]
          : prev.completedCourses,
        // Ajouter le cooldown
        layerCooldowns: {
          ...(prev.layerCooldowns || {}),
          [selectedLayer?.id || '']: layerCooldown
        },
        // 🔁 Sauvegarder l'historique de retry
        retryHistory: updatedRetryHistory
      };
    });

    const piValueUSD = (earnedPi * PI_GCV).toFixed(2);

    // 🎓 NOUVEAU: Stocker les résultats pour affichage détaillé
    setQuizResultsData({
      questions,
      answers,
      score,
      earnedXP,
      earnedPi,
      piValueUSD,
      isPremium
    });

    // Afficher l'écran de résultats au lieu d'un simple alert
    setQuizActive(false);
    setShowQuizResults(true);  // Afficher écran détaillé
  };

  // Handler pour fermer les résultats
  const handleCloseQuizResults = () => {
    setShowQuizResults(false);
    setQuizResultsData(null);
    setSelectedCourse(null);
    setShowCourseDetail(false);
    setRandomizedQuestions([]); // Reset pour fresh randomization au prochain quiz
  };

  // Handler pour réessayer le quiz
  const handleRetryQuiz = () =>{
    if (!selectedLayer) return;
    
    // 🔁 Obtenir les informations de retry pour ce layer
    const retryInfo = RetrySystem.getRetryInfo(
      selectedLayer.id,
      userProgress.retryHistory || {},
      userProgress.xp,
      isPremium,
      hasWatchedAdForRetry,
      AdManager.isRewardAvailable('RETRY')
    );
    
    // Afficher message explicatif
    const confirmRetry = window.confirm(
      `🔁 RÉESSAYER LE QUIZ\n\n${retryInfo.message}\n\n${retryInfo.canRetry ? t('course.continue') + 'r?' : ''}`
    );
    
    if (!confirmRetry || !retryInfo.canRetry) {
      return;
    }
    
    // Déduire le coût en XP si applicable
    if (retryInfo.costXP > 0) {
      setUserProgress((prev: any) => ({
        ...prev,
        xp: prev.xp - retryInfo.costXP,
        totalPoints: prev.totalPoints - retryInfo.costXP
      }));
      
      console.log(`💰 Coût de retry payé: -${retryInfo.costXP} XP`);
    }
    
    // Fermer les résultats et recommencer le quiz
    setShowQuizResults(false);
    setQuizResultsData(null);
    
    // Redémarrer le quiz avec le même layer
    startQuiz(selectedLayer, hasWatchedAdForRetry);
  };

  // 📺 Handle watching an ad
  const handleWatchAd = async () => {
    // 🛡️ ANTI-CHEAT: Empêcher double visionnage pour le même retry
    if (hasWatchedAdForRetry) {
        alert("⚠️ Vous avez déjà regardé une publicité pour cet essai.");
        return;
    }

    const success = await AdManager.showRewardedAd({
       type: 'RETRY',
       amount: 1
    });

    if (success) {
       setHasWatchedAdForRetry(true);
       logMessage('Ad Watched for Retry', 'info');
    }
  };

  const handleDiscoveryComplete = () => {
    if (!selectedLayer) return;
    
    const currentComplete = userProgress.completedLayers[selectedCourse.id] || [];
    
    // Mark as complete and award XP
    if (!currentComplete.includes(selectedLayer.id)) {
        setUserProgress((prev: any) => {
            const newXP = prev.xp + selectedLayer.xpReward;
            const { level, xpToNext } = calculateLevelFromXP(newXP);
            return {
                ...prev,
                completedLayers: {
                    ...prev.completedLayers,
                    [selectedCourse.id]: [...currentComplete, selectedLayer.id]
                },
                xp: newXP,
                level,
                xpToNext,
                totalPoints: prev.totalPoints + selectedLayer.xpReward
            };
        });
    }
    
    // Close discovery viewer and return to course layer selector
    setShowDiscovery(false);
    setShowCourseDetail(true);
    setSelectedLayer(null);
  };

  const handleDecisionLabComplete = (optionId: string) => {
    if (!currentScenario || !selectedLayer) return;
    
    // Find the selected option
    const selectedOption = currentScenario.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;
    
    // Calculate rewards based on decision quality
    const xpReward = selectedOption.impact('stats.xp') || selectedLayer.xpReward;
    const repReward = selectedOption.impact.reputation || 0;
    const piReward = selectedOption.impact.pi || 0;
    
    // Mark layer as complete and award rewards
    const currentComplete = userProgress.completedLayers[selectedCourse.id] || [];
    if (!currentComplete.includes(selectedLayer.id)) {
        setUserProgress((prev: any) => {
            const newXP = prev.xp + xpReward;
            const { level, xpToNext } = calculateLevelFromXP(newXP);
            return {
                ...prev,
                completedLayers: {
                    ...prev.completedLayers,
                    [selectedCourse.id]: [...currentComplete, selectedLayer.id]
                },
                xp: newXP,
                level,
                xpToNext,
                totalPoints: prev.totalPoints + xpReward,
                piBalance: prev.piBalance + piReward,
                reputation: {
                    ...prev.reputation,
                    total: prev.reputation.total + repReward,
                    precision: prev.reputation.precision + (selectedOption.isOptimal ? 10 : 0)
                }
            };
        });
        
        // Show success message
        const qualityMessage = selectedOption.isOptimal 
            ? '🎯 Décision optimale! +10 Precision'
            : '⚠️ Décision sous-optimale. Revoyez le raisonnement.';
        
        setTimeout(() => {
            alert(`✨ Decision Lab Terminé!\n\n${qualityMessage}\n\n+${xpReward} XP\n+${repReward} Reputation${piReward > 0 ? `\n+${piReward}π` : ''}`);
        }, 1500);
    }
    
    // Close decision lab and return to course
    setShowDecisionLab(false);
    setShowCourseDetail(true);
    setCurrentScenario(null);
  };


  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('✅ Lien copié dans le presse-papier !');
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('✅ Lien copié dans le presse-papier ! (Fallback)');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('❌ Impossible de copier le lien. Veuillez le sélectionner et copier manuellement.');
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-center">
          <div className="w-20 h-20 mb-6 mx-auto">
            <img 
              src="/assets/pioneer-academy-logo.jpg" 
              alt="Pioneer Academy" 
              className="w-full h-full rounded-full object-cover border-4 border-yellow-400 animate-pulse"
            />
          </div>
          <p className="text-white text-xl font-semibold">{t.connecting}</p>
        </div>
      </div>
    );
  }

  // Quiz Results View (Educational Feedback)
  if (showQuizResults && quizResultsData) {
      // 🔁 Calculate Retry Info dynamically to react to state changes (like watching ad)
      const currentRetryInfo = selectedLayer ? RetrySystem.getRetryInfo(
          selectedLayer.id,
          userProgress.retryHistory || {},
          userProgress.xp,
          isPremium,
          hasWatchedAdForRetry,
          AdManager.isRewardAvailable('RETRY')
      ) : undefined;

      return (
      <QuizResults
        questions={quizResultsData.questions}
        answers={quizResultsData.answers}
        score={quizResultsData.score}
        earnedXP={quizResultsData.earnedXP}
        earnedPi={quizResultsData.earnedPi}
        piValueUSD={quizResultsData.piValueUSD}
        isPremium={quizResultsData.isPremium}
        retryInfo={currentRetryInfo} // 🎯 Pass dynamic info
        onClose={handleCloseQuizResults}
        onRetry={handleRetryQuiz}
        onWatchAd={handleWatchAd} // 📺 Pass handler
      />
    );
  }

  // Discovery View
  if (showDiscovery && selectedLayer) {
      return (
          <DiscoveryViewer
            content={enrichDiscoveryLayer(selectedLayer.id, language)}
            layer={selectedLayer}
            onComplete={handleDiscoveryComplete}
            onClose={() => {
                setShowDiscovery(false);
                setShowCourseDetail(true);
            }}
          />
      );
  }

  // Course Detail View with Layer Selector
  if (showCourseDetail && selectedCourse) {
      return (
          <LayerSelector 
            course={selectedCourse} 
            userProgress={userProgress} 
            onSelectLayer={handleSelectLayer}
            onClose={() => setShowCourseDetail(false)}
          />
      );
  }

  // Quiz View
  if (quizActive) {
    // ✅ Use the randomized questions that were set in startQuiz
    const questions = randomizedQuestions.length > 0 ? randomizedQuestions : (selectedLayer?.questions || []).slice(0, 3);
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">{selectedCourse?.title}</h2>
              <span className="text-yellow-400 text-lg font-bold">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h3 className="text-white text-2xl font-bold mb-8">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option: string, index: number) => {
                const answered = answers.find(a => a.question === currentQuestion);
                const isSelected = answered && index === questions[currentQuestion].correct;

                return (
                  <button
                    key={index}
                    onClick={() => !answered && handleAnswer(index)}
                    disabled={answered !== undefined}
                    className={`w-full text-left p-4 rounded-xl transition-all transform ${answered
                      ? isSelected
                        ? 'bg-green-500/30 border-2 border-green-400'
                        : 'bg-white/10 opacity-50'
                      : 'bg-white/20 hover:bg-white/30 hover:scale-105'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${answered && isSelected ? 'bg-green-400 text-black' : 'bg-white/20 text-white'
                        }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-white font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Show explanation after answering */}
            {answers.find(a => a.question === currentQuestion) && questions[currentQuestion].explanation && (
              <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                <p className="text-blue-300 font-semibold mb-2">💡 Explication:</p>
                <p className="text-white">{questions[currentQuestion].explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === 'initial') {
    return (
      <LoginScreen 
        onLogin={handlePiLogin} 
        onGuest={handleGuestLogin} 
        loading={loading} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white pb-20 font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/pioneer-academy-logo.jpg" 
              alt="Pioneer Academy" 
              className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <h1 className="text-white font-bold text-base md:text-lg">Academy of Pi</h1>
              <p className="text-yellow-400 text-xs">Learn • Earn • Grow</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {/* Energy Header */}
            {user && (
              <EnergyHeader 
                energy={userProgress.energy} 
                onOpenShop={() => setShowEnergyShop(true)} 
              />
            )}

            {/* User Badge */}
            {user && (
              <UserBadge 
                status={UserAccessControl.getUserStatus(authStatus, kycStatus)} 
                size="small"
              />
            )}


              
              {/* 🌍 Language Toggle (Simplified & Functional) */}



            <button
              onClick={() => setShowProfile(true)}
              className="bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 flex items-center gap-2"
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400"
                />
              ) : (
                <span className="text-2xl">{user?.avatar}</span>
              )}
              <div className="text-left hidden md:block">
                <p className="text-white font-semibold text-sm">{user?.username}</p>
                <p className="text-yellow-400 text-xs">{isPremium ? '👑 Premium' : t('freeTier')}</p>
              </div>
            </button>
            
            <button 
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg text-red-300 border border-red-500/30 transition ml-2"
                title="Déconnexion"
            >
                <Lock size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-2xl font-bold">{t('profile.title')}</h3>
              <button onClick={() => setShowProfile(false)} className="text-white"><X size={24} /></button>
            </div>

            <div className="text-center mb-6 mt-6">
              {/* Profile Picture */}
              <div className="relative inline-block mb-4">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-yellow-400 overflow-hidden shadow-lg shadow-purple-500/30">
                    <span className="text-7xl leading-none select-none filter drop-shadow-md pb-2">{user?.avatar}</span>
                  </div>
                )}
                
                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-2 cursor-pointer transition shadow-lg">
                  <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                  <span className="text-lg">📷</span>
                </label>

                {/* Remove Picture Button */}
                {profilePicture && (
                  <button onClick={removeProfilePicture} className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 cursor-pointer transition shadow-lg" title="Supprimer la photo">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <h3 className="text-white text-2xl font-bold">{user?.username}</h3>
              
              <div className="bg-white/10 rounded-lg p-3 mt-3">
                <p className="text-purple-300 text-xs mb-1">User ID</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-yellow-400 font-mono font-bold text-sm">{user?.uid}</p>
                  <button onClick={() => copyToClipboard(user?.uid)} className="text-white hover:text-yellow-400"><Copy size={16} /></button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-purple-300 text-xs">{t('stats.level')}</p>
                <p className="text-white text-2xl font-bold">{userProgress.level}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-purple-300 text-xs">{t.streak || 'Streak'}</p>
                <p className="text-white text-2xl font-bold">{userProgress.streak}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-purple-300 text-xs">Courses</p>
                <p className="text-white text-2xl font-bold">{userProgress.completedCourses.length}</p>
              </div>
            </div>

            {/* ⚙️ Settings / Language Switch */}
            <div className="mb-6 border-t border-b border-white/10 py-4">
                <h4 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                  <Globe size={14} />
                  {t('profile.settings') || 'Settings'}
                </h4>
                
                <button onClick={toggleLanguage} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-between group">
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{language === 'fr' ? '🇫🇷' : '🇺🇸'}</span>
                    <span className="group-hover:text-yellow-400 transition-colors">{t('profile.language') || 'Language'}</span>
                  </span>
                  <span className="text-white/50 text-sm flex items-center gap-1 group-hover:text-white transition-colors">
                    {language === 'fr' ? 'Français' : 'English'} <ChevronRight size={16} />
                  </span>
                </button>
            </div>

            <div className="space-y-3">
                {/* XP Card */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div className="bg-purple-500/20 p-2.5 rounded-xl"><Zap className="text-purple-400" size={24} /></div>
                <div className="flex flex-col items-end">
                    <span className="text-white/60 text-xs uppercase tracking-wider">{t('stats.xp')}</span>
                    <span className="text-2xl font-bold text-white leading-none">{userProgress.xp}</span>
                </div>
                </div>

                {/* Balance Card */}
                <div onClick={() => setShowWallet(true)} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-2xl p-4 border border-orange-500/20 flex items-center justify-between cursor-pointer hover:border-orange-500/40 transition-colors">
                <div className="bg-orange-500/20 p-2.5 rounded-xl"><Wallet className="text-orange-400" size={24} /></div>
                <div className="flex flex-col items-end">
                    <span className="text-white/60 text-xs uppercase tracking-wider">{t('stats.balance')}</span>
                    <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-orange-400 leading-none">{userProgress.piBalance.toFixed(4)}</span>
                    <span className="text-orange-400 font-bold text-xs">π</span>
                    </div>
                </div>
                </div>

                {/* Rank Card */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div className="bg-blue-500/20 p-2.5 rounded-xl"><Target className="text-blue-400" size={24} /></div>
                <div className="flex flex-col items-end">
                    <span className="text-white/60 text-xs uppercase tracking-wider">{t('stats.rank')}</span>
                    <span className="text-xl font-bold text-white leading-none">#{userProgress.rank || 'N/A'}</span>
                </div>
                </div>
                
                {/* Referral */}
                <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl p-4 border border-green-400/30">
                <p className="text-green-400 font-semibold mb-2 flex items-center gap-2"><Share2 size={16} /> Code de Parrainage</p>
                <div className="flex items-center gap-2">
                    <p className="text-white font-mono font-bold text-lg flex-1">{userProgress.referralCode}</p>
                    <button onClick={() => copyToClipboard(userProgress.referralCode)} className="bg-green-400 text-black px-3 py-1 rounded-lg font-bold"><Copy size={16} /></button>
                </div>
                </div>
            </div>

            {/* 🔄 Progression Sync */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mt-6 text-center">
              <p className="text-blue-400 font-bold mb-2 text-sm flex items-center justify-center gap-2"><Target size={16} /> Synchronisation de Progression</p>
              <p className="text-gray-300 text-xs mb-3">Si des cours restent verrouillés malgré votre niveau élevé, utilisez cet outil.</p>
              <button onClick={() => {
                  const coursesToMark = [];
                  if (userProgress.level >= 2 && userProgress.xp >= 100) coursesToMark.push('pi-intro-101');
                  if (userProgress.level >= 3 && userProgress.xp >= 300) coursesToMark.push('pi-wallet-101');
                  if (userProgress.level >= 4 && userProgress.xp >= 500) coursesToMark.push('safety-101');
                  if (userProgress.level >= 5 && userProgress.xp >= 800) coursesToMark.push('kyc-101');
                  const newCompletions = coursesToMark.filter(id => !userProgress.completedCourses.includes(id));
                  if (newCompletions.length > 0) {
                    setUserProgress((prev: any) => ({ ...prev, completedCourses: [...prev.completedCourses, ...newCompletions] }));
                    alert(`✅ Synchronisation réussie!\n${newCompletions.length} cours déverrouillés.`);
                  } else {
                    alert('Votre progression est déjà à jour.');
                  }
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center gap-2">
                <Target size={16} /> Synchroniser Maintenant
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setShowPremiumModal(false)}>
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <Crown size={64} className="text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white text-3xl font-bold mb-2">{t('upgradePremium')}</h3>
              <p className="text-white/90">Débloquez TOUS les avantages exclusifs</p>
            </div>

            <div className="bg-black/30 rounded-xl p-6 mb-6">
              <div className="space-y-3 text-white">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>🎓 Cours exclusifs déverrouillés</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>⚡ Boost XP permanent x2</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>💸 Frais de retrait 0% (vs 2%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>👑 Badge Premium visible</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>🎯 Support prioritaire</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-400/20 rounded-xl p-4 mb-6 border border-yellow-400/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-bold text-2xl">0.01π</p>
                  <p className="text-white/80 text-sm">≈ ${(0.01 * PI_GCV).toFixed(2)} USD</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">par {t('month')}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePremiumUpgrade}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 rounded-xl text-lg hover:scale-105 transition mb-3"
            >
              {t('subscribe')}
            </button>

            <button
              onClick={() => setShowPremiumModal(false)}
              className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}

      {/* Staking Modal */}
      {showStaking && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setShowStaking(false)}>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-2xl font-bold">💎 {t('stakingTitle')}</h3>
              <button onClick={() => setShowStaking(false)} className="text-white"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-purple-300 text-xs mb-1">Disponible</p>
                <p className="text-white font-bold">{userProgress.piBalance.toFixed(4)}π</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-purple-300 text-xs mb-1">En Staking</p>
                <p className="text-yellow-400 font-bold">{userProgress.stakingBalance.toFixed(4)}π</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-purple-300 text-xs mb-1">Récompenses</p>
                <p className="text-green-400 font-bold">{userProgress.stakingRewards.toFixed(6)}π</p>
              </div>
            </div>

            {userProgress.stakingBalance > 0 ? (
              <div className="space-y-4">
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                  <p className="text-green-400 font-semibold mb-2">✅ Staking actif</p>
                  <div className="space-y-2 text-white text-sm">
                    <div className="flex justify-between">
                      <span>Période:</span>
                      <span className="font-bold">{userProgress.stakingPeriod} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APR:</span>
                      <span className="font-bold text-green-400">
                        {userProgress.stakingPeriod === 30 ? '5%' : userProgress.stakingPeriod === 60 ? '8%' : '12%'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total à récupérer:</span>
                      <span className="font-bold text-yellow-400">
                        {(userProgress.stakingBalance + userProgress.stakingRewards).toFixed(6)}π
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUnstake}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:scale-105 transition"
                >
                  🔓 {t('unstake')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                  <p className="text-blue-300 text-sm mb-3">
                    💡 Choisissez votre période de staking:
                  </p>
                  <div className="space-y-2">
                    {[
                      { days: 30, apr: 5, color: 'green' },
                      { days: 60, apr: 8, color: 'yellow' },
                      { days: 90, apr: 12, color: 'orange' }
                    ].map(plan => (
                      <button
                        key={plan.days}
                        onClick={() => {
                          const amount = prompt(`Montant à staker (Max: ${userProgress.piBalance.toFixed(6)}π):`);
                          if (amount) handleStaking(parseFloat(amount), plan.days);
                        }}
                        className={`w-full rounded-lg p-3 transition ${plan.color === 'green' ? 'bg-green-500/20 border border-green-400/30 hover:bg-green-500/30' :
                          plan.color === 'yellow' ? 'bg-yellow-500/20 border border-yellow-400/30 hover:bg-yellow-500/30' :
                            'bg-orange-500/20 border border-orange-400/30 hover:bg-orange-500/30'
                          }`}
                      >
                        <div className="flex justify-between items-center text-white">
                          <div className="text-left">
                            <p className="font-bold">{plan.days} jours</p>
                            <p className="text-xs opacity-80">Flexible</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${plan.color === 'green' ? 'text-green-400' :
                              plan.color === 'yellow' ? 'text-yellow-400' :
                                'text-orange-400'
                              }`}>{plan.apr}%</p>
                            <p className="text-xs opacity-80">APR</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setShowWallet(false)}>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-2xl font-bold">💳 Mon Wallet Pi</h3>
              <button onClick={() => setShowWallet(false)} className="text-white hover:text-yellow-400"><X size={24} /></button>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-6 text-black">
              <p className="text-sm opacity-80 mb-1">Balance totale</p>
              <p className="text-4xl font-bold mb-2">{userProgress.piBalance.toFixed(6)}π</p>
              <p className="text-lg font-semibold">≈ ${(userProgress.piBalance * PI_GCV).toFixed(2)} USD</p>
              <p className="text-xs opacity-80 mt-2">GCV: $314.159 / π</p>
            </div>

            {/* Wallet Connection */}
            {!walletAddress ? (
              <div className="mb-6">
                <PiWalletLink 
                  userToken={user?.accessToken || 'MOCK_TOKEN'} 
                  userId={user?.uid}
                  onSuccess={(data: any) => {
                    const { rewards, walletAddress: linkedAddr } = data;
                    setWalletAddress(linkedAddr || 'LINKED');
                    
                    if (rewards) {
                        setUserProgress((prev: any) => ({
                          ...prev,
                          piBalance: prev.piBalance + (rewards.pi || 0),
                          xp: prev.xp + (rewards.xp || 0)
                        }));
                        alert(`✅ Wallet lié et vérifié!\n\n+${rewards.xp} XP\n+${rewards.pi}π`);
                    } else {
                        alert(`✅ Wallet lié avec succès!`);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="bg-green-500/20 rounded-xl p-4 mb-4 border border-green-400/30">
                <p className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Wallet connecté
                </p>
                <p className="text-white text-sm font-mono break-all">{walletAddress}</p>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => {
                  const amount = prompt('Montant à retirer (Min: 0.001π):');
                  if (amount && parseFloat(amount) > 0) {
                    const val = parseFloat(amount);
                    if (val > userProgress.piBalance) {
                      alert('⚠️ Solde insuffisant!');
                      return;
                    }
                    const fee = isPremium ? 0 : val * 0.02;
                    const net = val - fee;
                    setUserProgress((prev: any) => ({ ...prev, piBalance: prev.piBalance - val }));
                    alert(`✅ Retrait effectué!\n\nMontant: ${val}π\nFrais: ${fee.toFixed(6)}π\nNet: ${net.toFixed(6)}π\n\n⏳ Traitement: 24-48h`);
                  }
                }}
                disabled={!walletAddress}
                className={`py-3 rounded-lg font-bold transition ${walletAddress
                  ? 'bg-gradient-to-r from-green-400 to-teal-500 text-black hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                💸 Retirer
              </button>
              <button
                onClick={() => {
                  const amount = prompt('Montant à déposer (π):');
                  if (amount && parseFloat(amount) > 0) {
                    setUserProgress((prev: any) => ({ ...prev, piBalance: prev.piBalance + parseFloat(amount) }));
                    alert(`✅ Dépôt de ${amount}π effectué!`);
                  }
                }}
                className="bg-gradient-to-r from-blue-400 to-cyan-500 text-black py-3 rounded-lg font-bold hover:scale-105 transition"
              >
                💰 Déposer
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-400/30">
              <p className="text-blue-300 text-xs">
                💡 <strong>Infos:</strong><br />
                • Minimum retrait: 0.001π<br />
                • Frais: {isPremium ? '0%' : '2%'} {isPremium && '(Premium)'}<br />
                • Délai: 24-48h<br />
                • KYC requis pour +1π
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 pb-24">
        {/* Stats */}
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/10 rounded-xl p-3 md:p-4 cursor-pointer hover:bg-white/15" onClick={() => setShowWallet(true)}>
            <p className="text-purple-300 text-[10px] md:text-xs mb-1">{t('stats.balance')}</p>
            <p className="text-white text-lg md:text-xl font-bold truncate">{userProgress.piBalance.toFixed(4)}π</p>
            <p className="text-green-400 text-[10px] md:text-xs truncate">≈ ${(userProgress.piBalance * PI_GCV).toFixed(2)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 md:p-4">
            <p className="text-purple-300 text-[10px] md:text-xs mb-1">{t('stats.level')}</p>
            <p className="text-white text-lg md:text-xl font-bold">{userProgress.level}</p>
            {isPremium && <span className="text-yellow-400 text-[10px] md:text-xs">👑 Premium</span>}
          </div>
          <div className="bg-white/10 rounded-xl p-3 md:p-4">
            <p className="text-purple-300 text-[10px] md:text-xs mb-1">{t.streak}</p>
            <p className="text-white text-lg md:text-xl font-bold flex items-center gap-1">
              <Flame size={16} className="text-orange-400 md:w-5 md:h-5" />
              {userProgress.streak}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 md:p-4 cursor-pointer hover:bg-white/15" onClick={() => {
            if (kycStatus !== 'verified') {
              alert("⚠️ Staking réservé aux Pioneers vérifiés (KYC).");
              return;
            }
            setShowStaking(true);
          }}>
            <p className="text-purple-300 text-[10px] md:text-xs mb-1">{t.staking}</p>
            <p className="text-yellow-400 text-lg md:text-xl font-bold truncate">{userProgress.stakingBalance.toFixed(4)}π</p>
            <p className="text-green-400 text-[10px] md:text-xs truncate">+{userProgress.stakingRewards.toFixed(6)}π</p>
          </div>
        </div>

        {/* Premium Banner */}
        {!isPremium && activeTab === 'courses' && (
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 mb-6 cursor-pointer hover:scale-105 transition" onClick={() => setShowPremiumModal(true)}>
            <h4 className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
              <Crown size={28} />
              {t.upgradePremium}
            </h4>
            <p className="text-white/90 mb-4">Débloquez tous les cours + Boost XP x2 + Frais 0%</p>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold">0.01π/mois</span>
              <span className="text-white text-sm">≈ ${(0.01 * PI_GCV).toFixed(2)} USD</span>
            </div>
          </div>
        )}

        {/* Courses Tab with Progressive Unlocking */}
        {activeTab === 'courses' && !showCourseDetail && (
          <CoursesTab
            userProgress={userProgress}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setShowCourseDetail(true);
            }}
          />
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Trophy size={48} className="text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white text-3xl font-bold mb-2">🏆 Top Pioneers</h3>
              <p className="text-purple-300">Classement hebdomadaire des meilleurs apprenants</p>
            </div>

            {[
              { rank: 1, username: 'PiMaster2024', xp: 5420, piEarned: 0.0172, avatar: '👑' },
              { rank: 2, username: 'CryptoLearner', xp: 4890, piEarned: 0.0156, avatar: '🎓' },
              { rank: 3, username: 'BlockchainPro', xp: 4350, piEarned: 0.0138, avatar: '⭐' },
              { rank: 4, username: 'WebThreeWizard', xp: 3920, piEarned: 0.0125, avatar: '🧙' },
              { rank: 5, username: 'DigitalPioneer', xp: 3540, piEarned: 0.0113, avatar: '🌟' },
              { rank: 6, username: user?.username, xp: userProgress.xp, piEarned: userProgress.piBalance, avatar: user?.avatar }
            ].map((player, index) => (
              <div
                key={player.rank}
                className={`bg-white/10 backdrop-blur-lg rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-105 ${index < 3 ? 'border-2' : ''
                  } ${player.rank === 1 ? 'border-yellow-400 shadow-xl shadow-yellow-400/20' :
                    player.rank === 2 ? 'border-gray-300 shadow-xl shadow-gray-300/20' :
                      player.rank === 3 ? 'border-orange-400 shadow-xl shadow-orange-400/20' : ''
                  }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                  player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                    player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                      'bg-white/20 text-white'
                  }`}>
                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-bold text-lg">{player.username}</p>
                    {player.rank <= 3 && <Star size={16} className="text-yellow-400" />}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-purple-300">
                      <span className="font-semibold text-white">{player.xp}</span> XP
                    </span>
                    <span className="text-orange-300">
                      <span className="font-semibold text-white">{player.piEarned.toFixed(6)}</span> π
                    </span>
                  </div>
                </div>
                {/* Show profile picture for current user, emoji for others */}
                {player.username === user?.username && profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <div className="text-4xl">{player.avatar}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Users size={48} className="text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white text-3xl font-bold mb-2">💥 Communauté</h3>
              <p className="text-purple-300">Apprenez et grandissez ensemble</p>
            </div>

            {/* Referral Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-6 mb-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowReferralDashboard(true)}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-xl mb-1 flex items-center gap-2">
                    <Users size={24} className="text-yellow-400" />
                    Parrainez vos amis
                  </h4>
                  <p className="text-purple-200 text-sm">Gagnez jusqu'à 200 XP et 0.001π par ami !</p>
                </div>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm">
                  Voir mon code
                </button>
              </div>
            </div>

            {/* Post Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Star size={24} className="text-yellow-400" />
                Partagez votre progression
              </h4>
              <textarea
                placeholder="Partagez vos réussites, posez des questions, aidez la communauté..."
                className="w-full bg-black/30 text-white rounded-lg p-4 mb-3 min-h-[100px] border border-white/20 focus:border-yellow-400 focus:outline-none"
                maxLength={500}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              
              {/* Emoji Picker for New Post */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['🔥', '🚀', '❤️', '👏', '💡', '🎉', '🧠', '💎'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setPostContent(prev => prev + emoji)}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-purple-300 text-sm">💡 Gagnez +10 XP par publication</span>
                <button
                  onClick={handlePublish}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition"
                >
                  📤 Publier
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h4 className="text-white font-bold text-xl mb-4">📱 Fil d&apos;actualité</h4>
              <div className="space-y-4">
                {[...socialPosts,
                { id: 101, user: 'CryptoLearner', avatar: '🎓', time: '2h', content: 'Je viens de terminer le cours Blockchain! Super instructif 🚀', likes: 24, comments: [] },
                { id: 102, user: 'PiMaster2024', avatar: '👑', time: '5h', content: 'Quelqu\'un a des conseils pour le quiz Cybersécurité?', likes: 15, comments: [] },
                { id: 103, user: 'WebThreeWizard', avatar: '🧙', time: '1j', content: 'Niveau 10 atteint! Merci Pioneer Academy 🎉', likes: 42, comments: [] }
                ].map((post: any) => (
                  <div key={post.id} className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-2">
                          {/* 📸 Smart Avatar: Real Pic > Emoji */}
                          {post.profilePicture ? (
                             <img src={post.profilePicture} className="w-10 h-10 rounded-full object-cover border border-white/20" alt="Avatar" />
                          ) : (
                             <div className="text-3xl">{post.avatar}</div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-bold">{post.user}</p>
                            <p className="text-purple-300 text-xs">Il y a {post.time}</p>
                          </div>
                          {/* Delete button - only for post owner */}
                          {post.userId === user?.uid && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-400/60 hover:text-red-400 transition"
                              title="Supprimer la publication"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        <p className="text-white mt-2">{post.content}</p>
                        
                        <div className="flex gap-4 mt-3 border-t border-white/5 pt-2">
                          <button className="text-purple-300 hover:text-yellow-400 transition flex items-center gap-1 text-sm">
                            ❤️ {post.likes}
                          </button>
                          
                          {/* Collapsible Comment Counter */}
                          <button 
                            className="text-purple-300 hover:text-yellow-400 transition text-sm flex items-center gap-1 font-semibold"
                            onClick={() => {
                                const postId = String(post.id);
                                setExpandedPosts(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(postId)) {
                                        newSet.delete(postId);
                                    } else {
                                        newSet.add(postId);
                                    }
                                    return newSet;
                                });
                            }}
                          >
                            💬 {(postComments[String(post.id)] || []).length || 'Commenter'}
                            {(postComments[String(post.id)] || []).length > 0 && (
                                <span className="ml-1 text-xs">
                                    {expandedPosts.has(String(post.id)) ? '▼' : '▶'}
                                </span>
                            )}
                          </button>
                        </div>
                        
                        {/* Integrated Comment System - Collapsible */}
                        {expandedPosts.has(String(post.id)) && (
                            <div className="mt-4 border-t border-white/5 pt-2 animate-fadeIn">
                                <CommentThread
                                    postId={String(post.id)}
                                    comments={postComments[String(post.id)] || []}
                                    currentUserId={user?.uid || 'guest'}
                                    currentUsername={user?.username || 'Invité'}
                                    currentAvatar={user?.avatar || '👤'}
                                    onAddComment={handleAddComment}
                                    onLikeComment={handleLikeComment}
                                    onDeleteComment={handleDeleteComment}
                                />
                            </div>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-black">
              <Users size={48} className="mx-auto mb-4" />
              <h4 className="text-2xl font-bold mb-2 text-center">Parrainez vos amis!</h4>
              <p className="text-center mb-4 opacity-90">
                Invitez vos amis à rejoindre Pioneer Academy et gagnez des récompenses
              </p>
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">50 XP</p>
                    <p className="text-sm opacity-80">par ami</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">0.0001π</p>
                    <p className="text-sm opacity-80">bonus</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(`https://piacademy.com/ref/${userProgress.referralCode}`)}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold w-full hover:bg-gray-900 transition"
              >
                📤 Partager mon lien
              </button>
            </div>
          </div>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Gift size={48} className="text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white text-3xl font-bold mb-2">🎁 Boutique</h3>
              <p className="text-purple-300">Échangez vos Pi contre des items exclusifs</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-black mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-80">Votre balance</p>
                  <p className="text-3xl font-bold">{userProgress.piBalance.toFixed(6)}π</p>
                  <p className="text-sm opacity-80">≈ ${(userProgress.piBalance * PI_GCV).toFixed(2)} USD</p>
                </div>
                <Award size={48} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Avatar Premium', cost: 0.001, icon: '👑', description: 'Démarquez-vous' },
                { name: 'Badge Légendaire', cost: 0.002, icon: '⭐', description: 'Statut exclusif' },
                { name: 'Boost XP x2', cost: 0.003, icon: '⚡', description: '24h de boost' },
                { name: 'Pass Premium', cost: 0.005, icon: '💎', description: 'Accès illimité' }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all hover:scale-105">
                  <div className="text-center mb-3">
                    <div className="text-5xl mb-2">{item.icon}</div>
                    <p className="text-white font-bold mb-1">{item.name}</p>
                    <p className="text-purple-300 text-xs">{item.description}</p>
                  </div>
                  <div className="text-center mb-3">
                    <p className="text-yellow-400 font-bold text-lg">{item.cost}π</p>
                    <p className="text-green-400 text-xs">~${(item.cost * PI_GCV).toFixed(2)} USD</p>
                  </div>
                  <button
                    onClick={() => {
                      if (kycStatus !== 'verified') {
                        alert(`⚠️ Accès refusé : ${t('profile.notifications')} KYC requise pour les achats.`);
                        return;
                      }
                      if (userProgress.piBalance >= item.cost) {
                        setUserProgress((prev: any) => ({ ...prev, piBalance: prev.piBalance - item.cost }));
                        alert(`✅ ${item.name} acheté!`);
                      } else {
                        alert('⚠️ Solde insuffisant!');
                      }
                    }}
                    className={`w-full font-bold py-2 rounded-lg transition ${userProgress.piBalance >= item.cost
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {userProgress.piBalance >= item.cost ? 'Acheter' : 'Insuffisant'}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mt-6">
              <h4 className="text-white font-bold text-xl mb-4">🎯 Packs Spéciaux</h4>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-bold text-lg">🚀 Pack Débutant</p>
                    <p className="text-purple-300 text-sm">Avatar + 2 Boosts + Badge</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">0.008π</p>
                    <p className="text-green-400 text-xs line-through opacity-50">0.012π</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (userProgress.piBalance >= 0.008) {
                      setUserProgress((prev: any) => ({ ...prev, piBalance: prev.piBalance - 0.008 }));
                      alert('🎉 Pack Débutant acheté!\n\nVous avez reçu:\n• Avatar Premium 👑\n• 2x Boost XP ⚡\n• Badge Légendaire ⭐');
                    } else {
                      alert('⚠️ Solde insuffisant!');
                    }
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-2 px-4 rounded-lg w-full hover:scale-105 transition"
                >
                  Économisez 33%
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decision Lab Modal */}
      {showDecisionLab && currentScenario && (
        <DecisionLab
          scenario={currentScenario}
          onComplete={handleDecisionLabComplete}
          onClose={() => {
            setShowDecisionLab(false);
            setShowCourseDetail(true);
            setCurrentScenario(null);
          }}
        />
      )}

      {/* Energy Shop Modal */}
      {showEnergyShop && (
        <EnergyShop
          energy={userProgress.energy}
          piBalance={userProgress.piBalance}
          onClose={() => setShowEnergyShop(false)}
          onPurchase={handleEnergyPurchase}
        />
      )}

      {/* Referral Dashboard Modal */}
      {showReferralDashboard && (
        <ReferralDashboard
          userToken="MOCK" // TODO: Replace with actual token
          onClose={() => setShowReferralDashboard(false)}
        />
      )}

      {/* Referral Test Component (Development Only) - DÉSACTIVÉ PAR L'UTILISATEUR */}
      {/* {process.env.NODE_ENV === 'development' && <ReferralTest />} */}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 z-20">
        <div className="max-w-7xl mx-auto flex justify-around p-3">
          {[
            { id: 'courses', icon: Book, label: t('nav.courses') },
            { id: 'leaderboard', icon: Trophy, label: t('nav.leaderboard') },
            { id: 'social', icon: Users, label: t('nav.social') },
            { id: 'shop', icon: Gift, label: t('nav.shop') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === tab.id
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black scale-110'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <tab.icon size={22} />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
