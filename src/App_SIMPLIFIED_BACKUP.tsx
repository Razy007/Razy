import React, { useState, useEffect } from 'react';
import { Trophy, Book, Users, Star, Zap, Award, ChevronRight, Target, Brain, Shield, Gift, Flame, CheckCircle, Globe, Copy, Lock, Crown, Share2, TrendingUp, DollarSign, Calendar, Percent, AlertCircle, X, Battery } from 'lucide-react';

// Services & Data
import { EnergySystem } from './services/EnergySystem';
import { AccessControl } from './services/AccessControl';
import { QuestionEngine } from './services/QuestionEngine';
import { courses } from './data/courses';
import type { UserProgress, Course, LayerType, QuizQuestion, QuestionHistoryEntry } from './types';

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
        subscribe: "Subscribe",
        energy: "Energy",
        recharging: "Recharging",
        mastered: "Mastered",
        cooldown: "Cooldown"
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
        subscribe: "S'abonner",
        energy: "Énergie",
        recharging: "Recharge",
        mastered: "Maîtrisé",
        cooldown: "Temps d'attente"
    }
};

const PI_GCV = 314.159;

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [language, setLanguage] = useState<'en' | 'fr'>('fr');
  const [showProfile, setShowProfile] = useState(false);
  const [showStaking, setShowStaking] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<LayerType | null>(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false); // Used for Quiz View now
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [postContent, setPostContent] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const t = translations[language];

  // Enhanced User Progress State
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 3,
    xp: 250,
    xpToNext: 50,
    streak: 5,
    piBalance: 0.0125,
    completedCourses: [],
    totalPoints: 250,
    referralCode: 'PIA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    lastLoginDate: Date.now(),
    stakingBalance: 0,
    stakingRewards: 0,
    stakingStartDate: null,
    stakingPeriod: null,
    // New Architecture
    energy: EnergySystem.initializeEnergy(),
    reputation: {
        total: 100,
        breakdown: { accuracy: 0.8, consistency: 0.9, mastery: 0.5, participation: 0.7 }
    },
    layerProgress: [],
    questionHistory: []
  });

  // Load Data
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
      const saved = localStorage.getItem('pi_academy_data_v2');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setUserProgress(prev => ({
               ...prev, 
               ...data.userProgress,
               // Ensure energy object methods are available by re-initializing if needed/calculations
               status: data.userProgress?.energy ? prev.energy : EnergySystem.initializeEnergy()
          }));
          
          // Re-hydrate energy if it was just a plain object
          if (data.userProgress?.energy) {
               setUserProgress(prev => ({
                   ...prev,
                   energy: { ...data.userProgress.energy }
               }));
          }

          setIsPremium(data.isPremium || false);
          setSocialPosts(data.socialPosts || []);
          setProfilePicture(data.profilePicture || null);
        } catch (e) {
          console.error("Failed to load saved data:", e);
          // Optional: clear corrupt data
          // localStorage.removeItem('pi_academy_data_v2');
        }
      }

      setLoading(false);
    }, 1000);
  }, []);

  // Energy Recharge Timer
  useEffect(() => {
      const timer = setInterval(() => {
          setUserProgress(prev => ({
              ...prev,
              energy: EnergySystem.getCurrentEnergy(prev.energy)
          }));
      }, 60000); // Check every minute
      return () => clearInterval(timer);
  }, []);

  // Save Data
  useEffect(() => {
    if (user) {
      localStorage.setItem('pi_academy_data_v2', JSON.stringify({
        userProgress,
        isPremium,
        socialPosts,
        profilePicture
      }));
    }
  }, [userProgress, isPremium, user, socialPosts, profilePicture]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copié!');
  };

  const handleLayerStart = (course: Course, layerId: LayerType) => {
    const layer = course.layers.find(l => l.id === layerId);
    if (!layer) return;

    // Check Access
    const access = AccessControl.canAccessLayer(
        course.id,
        layerId,
        layer.energyCost,
        userProgress.energy,
        userProgress.layerProgress
    );

    if (!access.allowed) {
        alert(`🔒 ${access.reason}`);
        return;
    }

    // Comnfirm Energy Consumption
    if (!window.confirm(`⚡ Démarrer ${layer.name}?\nCoût: ${layer.energyCost} Énergie`)) {
        return;
    }

    // Consume Energy
    const newEnergy = EnergySystem.consumeEnergy(userProgress.energy, layer.energyCost);
    if (!newEnergy) {
        alert("❌ Erreur d'énergie");
        return;
    }

    setUserProgress(prev => ({ ...prev, energy: newEnergy }));

    // Initialize Quiz
    const questions = QuestionEngine.selectQuestions(
        layer.questions,
        userProgress.questionHistory,
        3, // Select 3 questions per session
        layerId
    );

    setCurrentQuestions(questions);
    setSelectedCourse(course);
    setSelectedLayerId(layerId);
    setQuizActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswer = (answerIndex: number) => {
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correct;

    // Record history
    const historyEntry: QuestionHistoryEntry = QuestionEngine.recordAnswer(
        question.id, 
        selectedCourse!.id, 
        selectedLayerId!, 
        isCorrect
    );

    setUserProgress(prev => ({
        ...prev,
        questionHistory: [...prev.questionHistory, historyEntry]
    }));

    setAnswers([...answers, { question: currentQuestionIndex, correct: isCorrect }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      setTimeout(() => {
        completeQuiz(isCorrect ? score + 1 : score); // Pass predicted score just in case
      }, 1000);
    }
  };

  
  const completeQuiz = (finalScore?: number) => {
    if (!selectedCourse || !selectedLayerId) return;
    
    const actualScore = finalScore !== undefined ? finalScore : score;
    const layer = selectedCourse.layers.find(l => l.id === selectedLayerId)!;
    const percentage = (actualScore / currentQuestions.length) * 100;

    // Rewards
    const xpMultiplier = (isPremium ? 2 : 1) * layer.xpMultiplier;
    const earnedXP = Math.floor((10 * actualScore) * xpMultiplier); // Base 10 XP per question
    const earnedPi = (layer.piMultiplier * 0.0001 * actualScore); // Base Pi

    // Update Layer Progress
    const newLayerProgress = AccessControl.updateLayerProgress(
        selectedCourse.id,
        selectedLayerId,
        actualScore,
        currentQuestions.length,
        userProgress.layerProgress
    );

    // Check for Unlocks
    const updatedProgressWithUnlocks = AccessControl.unlockNextLayer(
        selectedCourse.id,
        selectedLayerId,
        newLayerProgress
    );

    setUserProgress(prev => ({
        ...prev,
        xp: prev.xp + earnedXP,
        piBalance: prev.piBalance + earnedPi,
        layerProgress: updatedProgressWithUnlocks
    }));

    setQuizActive(false);
    setSelectedCourse(null);
    setSelectedLayerId(null);

    const badge = percentage >= 80 ? '🏆 Layer Complete!' : '📚 Practice Needed';
    alert(`${badge}\n\nScore: ${actualScore}/${currentQuestions.length}\n+${earnedXP} XP\n+${earnedPi.toFixed(6)} π`);
  };

  const handleProfilePictureUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeProfilePicture = () => setProfilePicture(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

  // QUIZ VIEW
  if (quizActive && selectedCourse && currentQuestions.length > 0) {
      const question = currentQuestions[currentQuestionIndex];
      const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

      return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
              <div className="max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4">
                      <div className="flex justify-between items-center mb-4">
                          <h2 className="text-white text-xl font-bold">{selectedCourse.title} - {selectedLayerId}</h2>
                          <span className="text-yellow-400 text-lg font-bold">
                              {currentQuestionIndex + 1}/{currentQuestions.length}
                          </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                          <div className="bg-yellow-400 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                      <div className="mb-4 flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                              question.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                              question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              question.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-red-500/20 text-red-300'
                          }`}>
                              {question.difficulty.toUpperCase()}
                          </span>
                           <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold">
                              {question.cognitiveLevel.toUpperCase()}
                          </span>
                      </div>

                      <h3 className="text-white text-2xl font-bold mb-8">{question.question}</h3>

                      <div className="space-y-3">
                          {question.options.map((option, index) => {
                              const answered = answers.find(a => a.question === currentQuestionIndex);
                              const isSelected = answered && index === question.correct;
                              
                              return (
                                  <button
                                      key={index}
                                      onClick={() => !answered && handleAnswer(index)}
                                      disabled={!!answered}
                                      className={`w-full text-left p-4 rounded-xl transition-all ${
                                          answered 
                                          ? (index === question.correct ? 'bg-green-500/40 border-green-400' : 'bg-white/10 opacity-50')
                                          : 'bg-white/20 hover:bg-white/30'
                                      }`}
                                  >
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white font-bold">
                                              {String.fromCharCode(65 + index)}
                                          </div>
                                          <span className="text-white">{option}</span>
                                      </div>
                                  </button>
                              );
                          })}
                      </div>
                      
                      {answers.find(a => a.question === currentQuestionIndex) && (
                          <div className="mt-6 bg-blue-900/40 p-4 rounded-xl border border-blue-500/30">
                              <p className="text-blue-200 mb-1 font-bold">💡 Explication:</p>
                              <p className="text-white/90">{question.explanation}</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">π</div>
             <div>
                <h1 className="text-white font-bold text-lg hidden md:block">Pi Academy <span className="text-yellow-400 text-xs ml-1">v2.0</span></h1>
             </div>
          </div>

          <div className="flex items-center gap-4">
              {/* Energy Bar */}
              <div className="hidden md:flex flex-col items-end mr-4">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold">
                      <Zap size={16} fill="currentColor" />
                      <span>{EnergySystem.formatEnergyDisplay(userProgress.energy)}</span>
                  </div>
                  <div className="w-32 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${EnergySystem.getEnergyPercentage(userProgress.energy)}%` }} 
                      />
                  </div>
                  <span className="text-xs text-white/50">{EnergySystem.getRechargeTimeDisplay(userProgress.energy)}</span>
              </div>

             <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">
                {profilePicture ? (
                    <img src={profilePicture} className="w-8 h-8 rounded-full border border-yellow-400" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">{user?.avatar}</div>
                )}
                <span className="text-white font-semibold text-sm hidden sm:block">{user?.username}</span>
             </button>
          </div>
        </div>
      </div>

       {/* Mobile Energy Bar */}
       <div className="md:hidden bg-black/20 p-2 flex justify-between items-center px-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                <Zap size={14} fill="currentColor" />
                <span>{EnergySystem.formatEnergyDisplay(userProgress.energy)}</span>
            </div>
            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${EnergySystem.getEnergyPercentage(userProgress.energy)}%` }} 
                />
            </div>
       </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 pb-20">
          
          <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2">
              <Book className="text-purple-400" />
              {t.courses}
          </h2>

          <div className="space-y-8">
              {courses.map(course => (
                  <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                      <div className="p-6 bg-gradient-to-r from-white/10 to-transparent flex items-center gap-4">
                          <div className="text-4xl">{course.icon}</div>
                          <div>
                              <h3 className="text-xl font-bold text-white">{course.title}</h3>
                              <p className="text-white/60 text-sm">{course.description}</p>
                          </div>
                          <div className="ml-auto text-xs font-mono text-white/40 bg-black/20 px-2 py-1 rounded">
                              {course.category}
                          </div>
                      </div>

                      {/* Layers Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
                          {course.layers.map(layer => {
                              const status = AccessControl.getLayerStatus(course.id, layer.id, userProgress.layerProgress);
                              
                              return (
                                  <div 
                                    key={layer.id} 
                                    className={`relative p-4 rounded-xl border transition-all duration-300 ${
                                        !status.unlocked 
                                            ? 'bg-black/40 border-white/5 opacity-60 grayscale' 
                                            : status.mastered 
                                                ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30 shadow-lg shadow-green-900/20'
                                                : 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-yellow-400/50 cursor-pointer'
                                    }`}
                                    onClick={() => status.unlocked && !status.onCooldown && handleLayerStart(course, layer.id)}
                                  >
                                      {/* Status Icons */}
                                      <div className="absolute top-2 right-2">
                                          {!status.unlocked && <Lock size={16} className="text-white/40" />}
                                          {status.mastered && <Award size={18} className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                                          {status.onCooldown && <AlertCircle size={16} className="text-red-400" />}
                                      </div>

                                      <div className="mb-2">
                                          <p className="text-xs uppercase font-bold tracking-wider text-white/50 mb-1">{layer.id}</p>
                                          <h4 className={`font-bold ${status.mastered ? 'text-green-200' : 'text-white'}`}>{layer.name}</h4>
                                      </div>

                                      {/* Stats */}
                                      <div className="space-y-1 my-3">
                                          <div className="flex items-center gap-1.5 text-xs text-yellow-400/90">
                                              <Zap size={12} fill="currentColor" />
                                              <span>{layer.energyCost}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 text-xs text-purple-300">
                                              <Star size={12} />
                                              <span>{layer.xpMultiplier}x XP</span>
                                          </div>
                                      </div>

                                      {/* Footer / Action */}
                                      <div className="mt-3 pt-3 border-t border-white/10">
                                          {status.onCooldown ? (
                                              <p className="text-xs text-red-300 animate-pulse">
                                                  Cooldown: {Math.ceil((status.cooldownRemaining || 0)/60)}m
                                              </p>
                                          ) : !status.unlocked ? (
                                              <p className="text-xs text-white/30 flex items-center gap-1">
                                                  <Lock size={10} /> Locked
                                              </p>
                                          ) : (
                                              <div className="flex justify-between items-center">
                                                  <span className="text-xs text-white/60">Best: {Math.round(status.bestScore)}%</span>
                                                  <ChevronRight size={14} className="text-white/40" />
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              ))}
          </div>
      </div>

       {/* Profile Modal reused from before but simplified for now */}
       {showProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
           <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
               <div className="mb-4">
                   <div className="w-24 h-24 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-4xl mb-4">
                       {user?.avatar}
                   </div>
                   <h2 className="text-white text-2xl font-bold">{user?.username}</h2>
                   <p className="text-white/50 text-sm">Level {userProgress.level} Pioneer</p>
               </div>
               
               <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-white/5 p-3 rounded-lg">
                       <div className="text-yellow-400 font-bold text-xl">{userProgress.energy.current}</div>
                       <div className="text-xs text-white/50">Energy</div>
                   </div>
                   <div className="bg-white/5 p-3 rounded-lg">
                       <div className="text-purple-400 font-bold text-xl">{userProgress.xp}</div>
                       <div className="text-xs text-white/50">XP</div>
                   </div>
               </div>
               
               <button onClick={() => setShowProfile(false)} className="bg-white/10 hover:bg-white/20 text-white w-full py-3 rounded-xl font-bold transition">
                   Close
               </button>
           </div>
        </div>
       )}

    </div>
  );
};

export default App;
