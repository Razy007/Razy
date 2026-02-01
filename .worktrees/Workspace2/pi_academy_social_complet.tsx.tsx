import React, { useState, useEffect } from 'react';
import { Trophy, Book, Users, Star, Zap, Award, ChevronRight, Target, Brain, Shield, Gift, Flame, CheckCircle, Globe, Copy, Lock, Crown, Share2, TrendingUp, DollarSign, Calendar, Percent, AlertCircle, X } from 'lucide-react';

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

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('courses');
    const [language, setLanguage] = useState('fr');
    const [showProfile, setShowProfile] = useState(false);
    const [showWallet, setShowWallet] = useState(false);
    const [showStaking, setShowStaking] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseDetail, setShowCourseDetail] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [socialPosts, setSocialPosts] = useState([]);
    const [postContent, setPostContent] = useState('');

    const t = translations[language];

    const [userProgress, setUserProgress] = useState({
        level: 3,
        xp: 250,
        xpToNext: 50,
        streak: 5,
        piBalance: 0.0125,
        completedCourses: [1, 2],
        totalPoints: 250,
        referralCode: 'PIA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        lastLoginDate: null,
        stakingBalance: 0,
        stakingRewards: 0,
        stakingStartDate: null,
        stakingPeriod: null
    });

    const [courses] = useState([
        {
            id: 1,
            title: 'Introduction à Pi Network',
            category: 'Pi Basics',
            progress: 100,
            xp: 50,
            piReward: 0.0002,
            locked: false,
            premium: false,
            icon: '🥧',
            description: 'Découvrez les fondamentaux de Pi Network'
        },
        {
            id: 2,
            title: 'Blockchain Fundamentals',
            category: 'Web3',
            progress: 100,
            xp: 75,
            piReward: 0.0003,
            locked: false,
            premium: false,
            icon: '⛓️',
            description: 'Comprenez la technologie blockchain'
        },
        {
            id: 3,
            title: 'Cybersécurité Essentielle',
            category: 'Security',
            progress: 50,
            xp: 100,
            piReward: 0.0004,
            locked: false,
            premium: false,
            icon: '🔒',
            description: 'Protégez vos actifs numériques'
        },
        {
            id: 4,
            title: 'Économie Numérique',
            category: 'Economy',
            progress: 0,
            xp: 125,
            piReward: 0.0005,
            locked: false,
            premium: true,
            icon: '💰',
            description: 'Maîtrisez l\'économie du Web3'
        },
        {
            id: 5,
            title: 'Trading Crypto Avancé',
            category: 'Trading',
            progress: 0,
            xp: 150,
            piReward: 0.0006,
            locked: false,
            premium: true,
            icon: '📈',
            description: 'Stratégies de trading professionnelles'
        },
        {
            id: 6,
            title: 'DeFi & Smart Contracts',
            category: 'DeFi',
            progress: 0,
            xp: 175,
            piReward: 0.0007,
            locked: false,
            premium: true,
            icon: '⚡',
            description: 'Finance décentralisée avancée'
        }
    ]);

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
        ]
    };

    useEffect(() => {
        setTimeout(() => {
            const uid = 'PIA' + Math.random().toString(36).substring(2, 11).toUpperCase();
            setUser({
                uid: uid,
                username: 'Pioneer' + Math.floor(Math.random() * 10000),
                avatar: '🎓',
                joinDate: '2024-11-01'
            });

            // Load saved data
            const saved = localStorage.getItem('pi_academy_data');
            if (saved) {
                const data = JSON.parse(saved);
                setUserProgress(data.userProgress || userProgress);
                setIsPremium(data.isPremium || false);
                setSocialPosts(data.socialPosts || []);
            }

            setLoading(false);
        }, 1000);
    }, []);

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

                setUserProgress(prev => ({
                    ...prev,
                    stakingRewards: rewards
                }));
            }

            // Save to localStorage
            saveData();
        }
    }, [userProgress, isPremium, user]);

    const saveData = () => {
        if (user) {
            localStorage.setItem('pi_academy_data', JSON.stringify({
                userProgress,
                isPremium,
                socialPosts
            }));
        }
    };

    const handlePremiumUpgrade = () => {
        const PREMIUM_COST = 0.01;

        if (userProgress.piBalance < PREMIUM_COST) {
            alert(`⚠️ Solde insuffisant!\n\nCoût Premium: ${PREMIUM_COST}π\nVotre balance: ${userProgress.piBalance.toFixed(6)}π`);
            return;
        }

        setUserProgress(prev => ({
            ...prev,
            piBalance: prev.piBalance - PREMIUM_COST
        }));

        setIsPremium(true);
        setShowPremiumModal(false);

        alert('🎉 Bienvenue Premium!\n\n✨ Avantages activés:\n• Cours exclusifs déverrouillés\n• Boost XP permanent x2\n• Frais de retrait 0%\n• Support prioritaire\n• Badge Premium');
    };

    const handleStaking = (amount, period) => {
        if (amount <= 0 || amount > userProgress.piBalance) {
            alert('⚠️ Montant invalide!');
            return;
        }

        setUserProgress(prev => ({
            ...prev,
            piBalance: prev.piBalance - amount,
            stakingBalance: prev.stakingBalance + amount,
            stakingStartDate: Date.now(),
            stakingPeriod: period
        }));

        alert(`✅ Staking démarré!\n\n💎 Montant: ${amount}π\n📅 Période: ${period} jours\n📈 APR: ${period === 30 ? '5%' : period === 60 ? '8%' : '12%'}`);
        setShowStaking(false);
    };

    const handleUnstake = () => {
        if (userProgress.stakingBalance === 0) return;

        const total = userProgress.stakingBalance + userProgress.stakingRewards;

        setUserProgress(prev => ({
            ...prev,
            piBalance: prev.piBalance + total,
            stakingBalance: 0,
            stakingRewards: 0,
            stakingStartDate: null,
            stakingPeriod: null
        }));

        alert(`✅ Unstake réussi!\n\n💰 Total récupéré: ${total.toFixed(6)}π\n📊 Principal: ${userProgress.stakingBalance.toFixed(6)}π\n🎁 Récompenses: ${userProgress.stakingRewards.toFixed(6)}π`);
        setShowStaking(false);
    };

    const handlePublish = () => {
        if (!postContent.trim()) {
            alert('⚠️ Veuillez écrire quelque chose!');
            return;
        }

        const newPost = {
            user: user?.username,
            avatar: user?.avatar,
            time: 'À l\'instant',
            content: postContent,
            likes: 0,
            timestamp: Date.now()
        };

        setSocialPosts([newPost, ...socialPosts]);
        setUserProgress(prev => ({ ...prev, xp: prev.xp + 10, totalPoints: prev.totalPoints + 10 }));
        setPostContent('');
        alert('✅ Publication partagée!\n+10 XP gagné');
    };

    const startCourse = (course) => {
        if (course.premium && !isPremium) {
            alert('👑 Cours Premium!\n\nPassez Premium pour accéder à ce cours exclusif.');
            setShowPremiumModal(true);
            return;
        }
        setSelectedCourse(course);
        setShowCourseDetail(true);
    };

    const startQuiz = () => {
        setShowCourseDetail(false);
        setQuizActive(true);
        setCurrentQuestion(0);
        setScore(0);
        setAnswers([]);
    };

    const handleAnswer = (answerIndex) => {
        const questions = quizQuestions[selectedCourse.id] || quizQuestions[1];
        const isCorrect = answerIndex === questions[currentQuestion].correct;

        setAnswers([...answers, { question: currentQuestion, correct: isCorrect }]);

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
        const questions = quizQuestions[selectedCourse.id] || quizQuestions[1];
        const percentage = (score / questions.length) * 100;

        const xpMultiplier = isPremium ? 2 : 1;
        const earnedXP = Math.floor((selectedCourse.xp * percentage) / 100) * xpMultiplier;
        const earnedPi = percentage >= 80 ? selectedCourse.piReward : (selectedCourse.piReward * percentage) / 100;

        const newXP = userProgress.xp + earnedXP;
        const newLevel = Math.floor(newXP / 100) + 1;

        setUserProgress(prev => ({
            ...prev,
            xp: newXP,
            level: newLevel,
            xpToNext: (newLevel * 100) - (newXP % 100),
            piBalance: prev.piBalance + earnedPi,
            totalPoints: prev.totalPoints + earnedXP,
            completedCourses: percentage === 100 && !prev.completedCourses.includes(selectedCourse.id)
                ? [...prev.completedCourses, selectedCourse.id]
                : prev.completedCourses
        }));

        const piValueUSD = (earnedPi * PI_GCV).toFixed(2);

        setQuizActive(false);
        setSelectedCourse(null);
        setShowCourseDetail(false);

        const badge = percentage === 100 ? '🏆 Parfait!' : percentage >= 80 ? '⭐ Excellent!' : percentage >= 60 ? '👍 Bien!' : '📚 Continuez!';

        alert(`${badge}\n\nScore: ${score}/${questions.length} (${percentage.toFixed(0)}%)\n+${earnedXP} XP ${isPremium ? '(x2 Premium)' : ''}\n+${earnedPi.toFixed(6)}π (~$${piValueUSD} USD)\n\n${percentage >= 80 ? '✅ Cours validé!' : '💡 Réessayez pour plus de récompenses'}`);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('✅ Copié!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
                <div className="text-center">
                    <div className="w-20 h-20 mb-6 mx-auto">
                        <svg viewBox="0 0 200 200" className="animate-pulse">
                            <circle cx="100" cy="100" r="80" fill="#F5A623" stroke="#fff" strokeWidth="8" />
                            <text x="100" y="130" fontSize="80" fill="#fff" textAnchor="middle" fontWeight="bold">π</text>
                        </svg>
                    </div>
                    <p className="text-white text-xl font-semibold">{t.connecting}</p>
                </div>
            </div>
        );
    }

    // Course Detail View
    if (showCourseDetail && selectedCourse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => setShowCourseDetail(false)}
                        className="text-white mb-4 flex items-center gap-2 hover:text-yellow-400 transition"
                    >
                        ← Retour
                    </button>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                        <div className="text-center mb-6">
                            <div className="text-7xl mb-4">{selectedCourse.icon}</div>
                            <h2 className="text-white text-3xl font-bold mb-2">{selectedCourse.title}</h2>
                            <p className="text-purple-300 mb-4">{selectedCourse.description}</p>

                            <div className="flex justify-center gap-4 mb-6">
                                <div className="bg-yellow-400/20 px-4 py-2 rounded-lg">
                                    <Zap size={20} className="text-yellow-400 mx-auto mb-1" />
                                    <p className="text-yellow-400 font-bold">{selectedCourse.xp} XP {isPremium && 'x2'}</p>
                                </div>
                                <div className="bg-orange-400/20 px-4 py-2 rounded-lg">
                                    <Award size={20} className="text-orange-400 mx-auto mb-1" />
                                    <p className="text-orange-400 font-bold">{selectedCourse.piReward.toFixed(6)}π</p>
                                </div>
                                <div className="bg-green-400/20 px-4 py-2 rounded-lg">
                                    <Target size={20} className="text-green-400 mx-auto mb-1" />
                                    <p className="text-green-400 font-bold">~${(selectedCourse.piReward * PI_GCV).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={startQuiz}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 rounded-xl text-lg hover:scale-105 transition-transform"
                        >
                            🚀 Commencer le Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz View
    if (quizActive) {
        const questions = quizQuestions[selectedCourse.id] || quizQuestions[1];
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
                            {questions[currentQuestion].options.map((option, index) => {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {/* Header */}
            <div className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-30 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12">
                            <svg viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="80" fill="#F5A623" stroke="#fff" strokeWidth="6" />
                                <text x="100" y="130" fontSize="80" fill="#fff" textAnchor="middle" fontWeight="bold">π</text>
                                <circle cx="160" cy="60" r="10" fill="#fff" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">Pi Academy</h1>
                            <p className="text-yellow-400 text-xs">Learn • Earn • Grow</p>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <div className="relative group">
                            <button className="bg-white/10 p-2 rounded-lg hover:bg-white/20">
                                <Globe size={20} className="text-white" />
                            </button>
                            <div className="absolute right-0 mt-2 bg-black/95 rounded-xl p-2 hidden group-hover:block min-w-[140px] z-40 border border-white/20">
                                {[
                                    { code: 'en', name: 'English', flag: '🇬🇧' },
                                    { code: 'fr', name: 'Français', flag: '🇫🇷' }
                                ].map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 flex items-center gap-2 ${language === lang.code ? 'bg-yellow-400/20 text-yellow-400' : 'text-white'
                                            }`}
                                    >
                                        <span>{lang.flag}</span>
                                        <span className="text-sm">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowProfile(true)}
                            className="bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 flex items-center gap-2"
                        >
                            <span className="text-2xl">{user?.avatar}</span>
                            <div className="text-left hidden md:block">
                                <p className="text-white font-semibold text-sm">{user?.username}</p>
                                <p className="text-yellow-400 text-xs">{isPremium ? '👑 Premium' : t.freeTier}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {showProfile && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
                    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white text-2xl font-bold">{t.profile}</h3>
                            <button onClick={() => setShowProfile(false)} className="text-white"><X size={24} /></button>
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-7xl mb-3">{user?.avatar}</div>
                            <h3 className="text-white text-2xl font-bold">{user?.username}</h3>

                            <div className="bg-white/10 rounded-lg p-3 mt-3">
                                <p className="text-purple-300 text-xs mb-1">User ID</p>
                                <div className="flex items-center justify-center gap-2">
                                    <p className="text-yellow-400 font-mono font-bold text-sm">{user?.uid}</p>
                                    <button onClick={() => copyToClipboard(user?.uid)} className="text-white hover:text-yellow-400">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-white/10 rounded-xl p-3 text-center">
                                <p className="text-purple-300 text-xs">{t.level}</p>
                                <p className="text-white text-2xl font-bold">{userProgress.level}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 text-center">
                                <p className="text-purple-300 text-xs">{t.streak}</p>
                                <p className="text-white text-2xl font-bold">{userProgress.streak}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 text-center">
                                <p className="text-purple-300 text-xs">Courses</p>
                                <p className="text-white text-2xl font-bold">{userProgress.completedCourses.length}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl p-4 mb-4 border border-green-400/30">
                            <p className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                                <Share2 size={16} />
                                Code de Parrainage
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-white font-mono font-bold text-lg flex-1">{userProgress.referralCode}</p>
                                <button
                                    onClick={() => copyToClipboard(userProgress.referralCode)}
                                    className="bg-green-400 text-black px-3 py-1 rounded-lg font-bold"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Modal */}
            {showPremiumModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPremiumModal(false)}>
                    <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <Crown size={64} className="text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-white text-3xl font-bold mb-2">{t.upgradePremium}</h3>
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
                                    <p className="text-white font-semibold">par {t.month}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePremiumUpgrade}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 rounded-xl text-lg hover:scale-105 transition mb-3"
                        >
                            {t.subscribe}
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowStaking(false)}>
                    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white text-2xl font-bold">💎 {t.stakingTitle}</h3>
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
                                    🔓 {t.unstake}
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowWallet(false)}>
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
                            <div className="bg-white/10 rounded-xl p-4 mb-4">
                                <p className="text-white font-semibold mb-3">🔐 Connectez votre Wallet Pi</p>
                                <p className="text-purple-300 text-sm mb-4">Nécessaire pour effectuer des transactions</p>
                                <button
                                    onClick={() => {
                                        const mockAddress = 'G' + Math.random().toString(36).substring(2, 15).toUpperCase();
                                        setWalletAddress(mockAddress);
                                        alert(`✅ Wallet connecté!\n\nAdresse: ${mockAddress}`);
                                    }}
                                    className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
                                >
                                    Connecter Wallet Pi
                                </button>
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
                                        setUserProgress(prev => ({ ...prev, piBalance: prev.piBalance - val }));
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
                                        setUserProgress(prev => ({ ...prev, piBalance: prev.piBalance + parseFloat(amount) }));
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/15" onClick={() => setShowWallet(true)}>
                        <p className="text-purple-300 text-xs mb-1">{t.balance}</p>
                        <p className="text-white text-xl font-bold">{userProgress.piBalance.toFixed(4)}π</p>
                        <p className="text-green-400 text-xs">≈ ${(userProgress.piBalance * PI_GCV).toFixed(2)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-purple-300 text-xs mb-1">{t.level}</p>
                        <p className="text-white text-xl font-bold">{userProgress.level}</p>
                        {isPremium && <span className="text-yellow-400 text-xs">👑 Premium</span>}
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-purple-300 text-xs mb-1">{t.streak}</p>
                        <p className="text-white text-xl font-bold flex items-center gap-1">
                            <Flame size={20} className="text-orange-400" />
                            {userProgress.streak}
                        </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/15" onClick={() => setShowStaking(true)}>
                        <p className="text-purple-300 text-xs mb-1">{t.staking}</p>
                        <p className="text-yellow-400 text-xl font-bold">{userProgress.stakingBalance.toFixed(4)}π</p>
                        <p className="text-green-400 text-xs">+{userProgress.stakingRewards.toFixed(6)}π</p>
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

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <>
                        <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                            <Brain size={28} className="text-yellow-400" />
                            {t.courses}
                        </h3>
                        <div className="grid gap-4">
                            {courses.map(course => (
                                <div
                                    key={course.id}
                                    onClick={() => startCourse(course)}
                                    className={`bg-white/10 rounded-xl p-5 border-2 transition-all cursor-pointer ${course.premium && !isPremium
                                            ? 'border-purple-500 opacity-80'
                                            : 'border-transparent hover:border-yellow-400 hover:bg-white/15'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl">{course.icon}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-white font-bold text-lg">{course.title}</h4>
                                                {course.premium && <Crown size={16} className="text-purple-400" />}
                                            </div>
                                            <p className="text-purple-300 text-sm mb-2">{course.category}</p>
                                            <div className="flex gap-3">
                                                <span className="text-yellow-400 text-sm font-bold">
                                                    +{course.xp} XP {isPremium && 'x2'}
                                                </span>
                                                <span className="text-orange-400 text-sm font-bold">{course.piReward.toFixed(6)}π</span>
                                                <span className="text-green-400 text-sm">~${(course.piReward * PI_GCV).toFixed(2)}</span>
                                            </div>
                                            {course.progress > 0 && (
                                                <div className="mt-3">
                                                    <div className="bg-black/30 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {course.premium && !isPremium ? (
                                            <Lock size={28} className="text-purple-400" />
                                        ) : userProgress.completedCourses.includes(course.id) ? (
                                            <CheckCircle size={28} className="text-green-400" />
                                        ) : (
                                            <ChevronRight size={28} className="text-yellow-400" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ad Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 mt-6 text-center">
                            <p className="text-white text-sm font-semibold">📢 Sponsorisé par Pi Ecosystem</p>
                            <p className="text-white/80 text-xs mt-1">Découvrez les nouvelles dApps Pi</p>
                        </div>
                    </>
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
                                <div className="text-4xl">{player.avatar}</div>
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
                            <h4 className="text-white font-bold text-xl mb-4">📱 Fil d'actualité</h4>
                            <div className="space-y-4">
                                {[...socialPosts,
                                { user: 'CryptoLearner', avatar: '🎓', time: '2h', content: 'Je viens de terminer le cours Blockchain! Super instructif 🚀', likes: 24 },
                                { user: 'PiMaster2024', avatar: '👑', time: '5h', content: 'Quelqu\'un a des conseils pour le quiz Cybersécurité?', likes: 15 },
                                { user: 'WebThreeWizard', avatar: '🧙', time: '1j', content: 'Niveau 10 atteint! Merci Pi Academy 🎉', likes: 42 }
                                ].map((post, i) => (
                                    <div key={i} className="bg-black/30 rounded-lg p-4">
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="text-3xl">{post.avatar}</div>
                                            <div className="flex-1">
                                                <p className="text-white font-bold">{post.user}</p>
                                                <p className="text-purple-300 text-xs">Il y a {post.time}</p>
                                                <p className="text-white mt-2">{post.content}</p>
                                                <div className="flex gap-4 mt-3">
                                                    <button className="text-purple-300 hover:text-yellow-400 transition flex items-center gap-1 text-sm">
                                                        ❤️ {post.likes}
                                                    </button>
                                                    <button className="text-purple-300 hover:text-yellow-400 transition text-sm">
                                                        💬 Répondre
                                                    </button>
                                                </div>
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
                                Invitez vos amis à rejoindre Pi Academy et gagnez des récompenses
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
                                            if (userProgress.piBalance >= item.cost) {
                                                setUserProgress(prev => ({ ...prev, piBalance: prev.piBalance - item.cost }));
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
                                            setUserProgress(prev => ({ ...prev, piBalance: prev.piBalance - 0.008 }));
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

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 z-20">
                <div className="max-w-7xl mx-auto flex justify-around p-3">
                    {[
                        { id: 'courses', icon: Book, label: t.courses },
                        { id: 'leaderboard', icon: Trophy, label: t.leaderboard },
                        { id: 'social', icon: Users, label: t.social },
                        { id: 'shop', icon: Gift, label: t.shop }
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