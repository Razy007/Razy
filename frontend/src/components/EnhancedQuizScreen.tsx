import React, { useState, useEffect } from 'react';
import { DynamicQuestionEngine } from '../services/edu/DynamicQuestionEngine';
import { 
    GamificationEngine, 
    ComboSystem, 
    ChallengeSystem,
    ComboState,
    DailyChallenge,
    PowerUp,
    AVAILABLE_POWERUPS
} from '../services/edu/GamificationSystem';
import { GamificationHUD } from './GamificationHUD';
import { QuizQuestion, UserProgress, Layer } from '../types';

interface EnhancedQuizScreenProps {
    layer: Layer;
    userProgress: UserProgress;
    onComplete: (rewards: { xp: number; pi: number }) => void;
    onProgressUpdate: (progress: Partial<UserProgress>) => void;
}

/**
 * 🎮 ENHANCED QUIZ SCREEN
 * 
 * Exemple d'intégration complète du système de gamification
 * dans un écran de quiz
 */
export const EnhancedQuizScreen: React.FC<EnhancedQuizScreenProps> = ({
    layer,
    userProgress,
    onComplete,
    onProgressUpdate
}) => {
    // ========== STATE ==========
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    
    // ⏱️ TIMER & ANTI-BOT (Patch C)
    const [timeLeft, setTimeLeft] = useState(30);
    const questionStartTimeRef = React.useRef<number>(Date.now());
    const isBotRef = React.useRef(false);

    // Gamification State
    const [comboState, setComboState] = useState<ComboState>({
        current: 0,
        best: 0,
        multiplier: 1.0,
        lastAnswerTime: 0,
        active: false
    });
    
    const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
    const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
    const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);
    const [totalRewards, setTotalRewards] = useState({ xp: 0, pi: 0 });
    const [notifications, setNotifications] = useState<string[]>([]);

    // ========== INITIALIZATION ==========
    useEffect(() => {
        initializeQuiz();
        loadDailyChallenges();
    }, [layer]);

    // ⏱️ TIMER LOGIC
    useEffect(() => {
        // Reset timer on new question
        setTimeLeft(30);
        questionStartTimeRef.current = Date.now();
        isBotRef.current = false;
        
        const timer = setInterval(() => {
            if (selectedAnswer !== null) return; // Stop timer if answered
            
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp(); // Auto-fail
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex]); // Reset on index change

    const handleTimeUp = () => {
        if (selectedAnswer !== null) return;
        addNotification("⏰ Temps écoulé !");
        handleAnswerSelect(-1); // -1 = Wrong answer / Timeout
    };

    const initializeQuiz = () => {
        // Générer des questions dynamiques et contextuelles
        const dynamicQuestions = DynamicQuestionEngine.generateContextualQuestions(
            layer,
            userProgress,
            5 // nombre de questions
        );

        // Fallback sur les questions du layer si le pool est vide
        const finalQuestions = dynamicQuestions.length > 0 
            ? dynamicQuestions 
            : layer.questions || [];

        setQuestions(finalQuestions);
        
        // Log pour debug
        console.log(`📚 Quiz initialisé avec ${finalQuestions.length} questions`);
        console.log(`🎯 Difficulté adaptée au niveau ${userProgress.level}`);
    };

    const loadDailyChallenges = () => {
        const challenges = ChallengeSystem.generateDailyChallenges(userProgress);
        setDailyChallenges(challenges);
    };

    // ========== ANSWER HANDLING ==========
    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null) return; // Déjà répondu
        
        // 🤖 ANTI-BOT CHECK (< 800ms)
        const reactionTime = Date.now() - questionStartTimeRef.current;
        if (reactionTime < 800 && answerIndex !== -1) { // -1 is timeout, bypass check
             isBotRef.current = true;
             addNotification("⚠️ Trop rapide ! (Anti-Bot)");
             // Penalty? Or just ignore? Let's ignore click.
             return; 
        }

        setSelectedAnswer(answerIndex);
        setShowExplanation(true);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answerIndex === currentQuestion.correct; // If -1, always false

        // Mettre à jour le score
        setScore(prev => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            total: prev.total + 1
        }));

        // Mettre à jour le combo
        const { newState, bonusXp, message } = ComboSystem.updateCombo(
            comboState,
            isCorrect,
            Date.now()
        );
        
        setComboState(newState);

        // Afficher le message de combo
        if (message) {
            addNotification(message);
        }

        // Calculer les récompenses avec multiplicateurs
        const baseXp = isCorrect ? (currentQuestion.xpReward || 10) : 0;
        const basePi = isCorrect ? 0.0001 : 0;

        const { xp, pi } = GamificationEngine.calculateRewards(
            baseXp,
            basePi,
            activePowerUps,
            newState.multiplier
        );

        // Ajouter le bonus XP du combo
        const totalXp = xp + (bonusXp || 0);

        // Accumuler les récompenses
        setTotalRewards(prev => ({
            xp: prev.xp + totalXp,
            pi: prev.pi + pi
        }));

        // Mettre à jour la progression de l'utilisateur
        const updatedProgress: Partial<UserProgress> = {
            xp: userProgress.xp + totalXp,
            piBalance: userProgress.piBalance + pi,
            questionHistory: {
                ...userProgress.questionHistory,
                [currentQuestion.id]: {
                    lastAnswered: Date.now(),
                    correct: isCorrect
                }
            }
        };

        onProgressUpdate(updatedProgress);

        // Vérifier les achievements
        checkAchievements({
            ...userProgress,
            ...updatedProgress
        } as UserProgress);

        // Mettre à jour les défis
        updateChallenges(isCorrect);

        // Afficher la notification de récompense
        if (isCorrect) {
            addNotification(`✅ +${totalXp} XP | +${pi.toFixed(6)} Pi`);
        } else if (answerIndex !== -1) {
            addNotification(`❌ Combo perdu!`);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            // Quiz terminé
            completeQuiz();
        }
    };

    const completeQuiz = () => {
        // Calculer les récompenses finales
        const accuracy = (score.correct / score.total) * 100;
        
        // Bonus pour score parfait
        let bonusXp = 0;
        let bonusPi = 0;
        
        if (accuracy === 100) {
            bonusXp = 100;
            bonusPi = 0.0005;
            addNotification('🎉 Score Parfait! Bonus: +100 XP, +0.0005 Pi');
        } else if (accuracy >= 80) {
            bonusXp = 50;
            bonusPi = 0.0002;
            addNotification('⭐ Excellent! Bonus: +50 XP, +0.0002 Pi');
        }

        const finalRewards = {
            xp: totalRewards.xp + bonusXp,
            pi: totalRewards.pi + bonusPi
        };

        // Mettre à jour la réputation
        const updatedReputation = {
            ...userProgress.reputation,
            precision: Math.round(
                ((userProgress.reputation.precision * 0.8) + (accuracy * 0.2))
            )
        };

        onProgressUpdate({
            reputation: updatedReputation
        });

        // Callback de complétion
        onComplete(finalRewards);
    };

    // ========== ACHIEVEMENTS ==========
    const checkAchievements = (progress: UserProgress) => {
        const newAchievements = GamificationEngine.checkAchievements(
            progress,
            unlockedAchievements
        );

        if (newAchievements.length > 0) {
            for (const achievement of newAchievements) {
                addNotification(
                    `🏆 Achievement Débloqué: ${achievement.title}! +${achievement.xpReward} XP`
                );
                
                // Ajouter les récompenses de l'achievement
                setTotalRewards(prev => ({
                    xp: prev.xp + achievement.xpReward,
                    pi: prev.pi + achievement.piReward
                }));
            }
        }
    };

    // ========== CHALLENGES ==========
    const updateChallenges = (isCorrect: boolean) => {
        setDailyChallenges(prev => prev.map(challenge => {
            if (challenge.completed) return challenge;

            let newProgress = challenge.progress;

            // Mettre à jour selon le type de défi
            if (challenge.id === 'daily_questions' && isCorrect) {
                newProgress++;
            } else if (challenge.id === 'daily_perfect' && isCorrect) {
                newProgress = comboState.current;
            }

            const completed = newProgress >= challenge.target;

            if (completed && !challenge.completed) {
                addNotification(
                    `🎯 Défi Complété: ${challenge.title}! +${challenge.xpReward} XP`
                );
                
                setTotalRewards(prev => ({
                    xp: prev.xp + challenge.xpReward,
                    pi: prev.pi + challenge.piReward
                }));
            }

            return {
                ...challenge,
                progress: newProgress,
                completed
            };
        }));
    };

    // ========== POWER-UPS ==========
    const handlePowerUpPurchase = (powerUpId: string) => {
        const powerUp = AVAILABLE_POWERUPS.find(p => p.id === powerUpId);
        if (!powerUp) return;

        // Vérifier le solde
        if (userProgress.piBalance < powerUp.piCost) {
            addNotification('❌ Solde Pi insuffisant!');
            return;
        }

        // Déduire le coût
        onProgressUpdate({
            piBalance: userProgress.piBalance - powerUp.piCost
        });

        // Activer le power-up
        const activatedPowerUp: PowerUp = {
            ...powerUp,
            active: true,
            expiresAt: powerUp.duration > 0 ? Date.now() + powerUp.duration : undefined
        };

        setActivePowerUps(prev => [...prev, activatedPowerUp]);
        addNotification(`✨ Power-Up Activé: ${powerUp.name}!`);

        // Appliquer l'effet immédiat si nécessaire
        if (powerUp.effect === 'energy_boost') {
            onProgressUpdate({
                energy: {
                    ...userProgress.energy,
                    current: Math.min(
                        userProgress.energy.current + (powerUp.multiplier || 50),
                        userProgress.energy.max
                    )
                }
            });
        }
    };

    // ========== NOTIFICATIONS ==========
    const addNotification = (message: string) => {
        setNotifications(prev => [...prev, message]);
        
        // Auto-remove après 3 secondes
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n !== message));
        }, 3000);
    };

    // ========== RENDER ==========
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-10 space-y-8">
                <div className="relative">
                   <div className="w-24 h-24 border-8 border-yellow-500/10 border-t-yellow-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-2xl font-black text-yellow-500">π</span>
                   </div>
                </div>
                <div className="text-center space-y-3">
                   <p className="text-2xl font-black text-white tracking-tighter">Génération Master...</p>
                   <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">Adaptation du pool de questions à votre niveau d'Expertise</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 lg:p-12 selection:bg-yellow-500/30 overflow-x-hidden">
            {/* Gamification HUD */}
            <GamificationHUD
                userProgress={userProgress}
                comboState={comboState}
                dailyChallenges={dailyChallenges}
                onPowerUpPurchase={handlePowerUpPurchase}
            />

            {/* Quiz Container */}
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                {/* Timer & Progress Header */}
                <div className="flex justify-between items-end px-4 mb-2">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Synchronisation Temporelle</p>
                       <div className={`
                           flex items-center gap-4 px-8 py-4 rounded-2xl font-black border-2 transition-all duration-300
                           ${timeLeft <= 5 ? 'bg-red-500/20 border-red-500 animate-pulse text-red-500' : 'bg-white/5 border-white/10 text-yellow-500'}
                       `}>
                           <span className="text-2xl">⏱️</span>
                           <span className="text-3xl tracking-tighter">
                               {timeLeft}S
                           </span>
                       </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Module Progress</p>
                        <p className="text-3xl font-black text-white tracking-tighter">
                          {currentQuestionIndex + 1}<span className="text-white/20">/{questions.length}</span>
                        </p>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative h-6 bg-white/5 rounded-full border border-white/5 overflow-hidden shadow-2xl">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      style={{ width: `${progress}%` }} 
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1] pointer-events-none" />
                </div>

                {/* Question Card */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-16 shadow-3xl relative overflow-hidden group">
                    <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
                        <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                            currentQuestion.difficulty === 'easy' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                            currentQuestion.difficulty === 'medium' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                            'bg-purple-500/10 border-purple-500/30 text-purple-500'
                        }`}>
                            {currentQuestion.difficulty}
                        </span>
                        <span className="px-5 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border border-white/5 shadow-lg">
                           {currentQuestion.topic}
                        </span>
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-black text-white mb-16 tracking-tighter leading-tight lg:leading-[1.1]">
                      {currentQuestion.question}
                    </h2>

                    {/* Options */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`
                                  relative flex items-center gap-6 p-8 rounded-[2rem] border-2 transition-all duration-500 group/btn
                                  ${selectedAnswer === null 
                                    ? 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/20 active:scale-95' 
                                    : index === currentQuestion.correct
                                      ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                                      : selectedAnswer === index
                                        ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
                                        : 'bg-white/[0.02] border-white/5 opacity-50'
                                  }
                                  ${showExplanation && index === currentQuestion.correct && selectedAnswer !== index ? 'ring-4 ring-green-500/20' : ''}
                                `}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={selectedAnswer !== null}
                            >
                                <div className={`
                                  w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500
                                  ${selectedAnswer === null 
                                    ? 'bg-white/5 text-white/20 group-hover/btn:bg-white/10 group-hover/btn:text-white' 
                                    : index === currentQuestion.correct
                                      ? 'bg-green-500 text-black'
                                      : selectedAnswer === index
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/5 text-white/20'
                                  }
                                `}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className={`text-xl font-bold tracking-tight text-left ${selectedAnswer === null ? 'text-white/70 group-hover/btn:text-white' : 'text-white'}`}>
                                  {option}
                                </span>
                                
                                {selectedAnswer !== null && index === currentQuestion.correct && (
                                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500 animate-bounce">✨</div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                        <div className="animate-in fade-in slide-in-from-top-6 duration-700">
                          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group/exp">
                              <div className="flex items-center gap-4 mb-6">
                                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Knowledge Base</p>
                                <div className="flex-1 h-px bg-yellow-500/20"></div>
                              </div>
                              <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">Analyse du Protocole</h3>
                              <p className="text-white/40 text-lg font-medium leading-relaxed mb-10 italic">
                                "{currentQuestion.explanation}"
                              </p>
                              
                              <button 
                                className="w-full py-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-500 text-xs flex items-center justify-center gap-4"
                                onClick={handleNextQuestion}
                              >
                                  {currentQuestionIndex < questions.length - 1 
                                      ? <>Question Suivante <span className="text-xl">→</span></>
                                      : <>Finaliser l'Extraction <span className="text-xl">🎉</span></>}
                              </button>
                              
                              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl" />
                          </div>
                        </div>
                    )}
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                </div>

                {/* Score Stats HUD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] text-center space-y-2 group hover:bg-white/[0.08] transition-all">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Validated Hits</p>
                        <p className="text-4xl font-black text-white tracking-tighter">
                            {score.correct}<span className="text-white/20">/{score.total}</span>
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] text-center space-y-2 group hover:bg-white/[0.08] transition-all">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Mission Accuracy</p>
                        <p className="text-4xl font-black text-yellow-500 tracking-tighter">
                            {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] text-center space-y-2 group hover:bg-white/[0.08] transition-all">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Total Rewards Earned</p>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white tracking-tighter">+{totalRewards.xp} XP</span>
                            <span className="text-xl font-black text-yellow-500 tracking-tighter">+{totalRewards.pi.toFixed(6)} π</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications Stack */}
            <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50 pointer-events-none">
                {notifications.map((notification, index) => (
                    <div 
                      key={index} 
                      className="px-8 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-3xl animate-in slide-in-from-right-10 fade-in duration-500 flex items-center gap-4"
                    >
                        <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center text-lg">⚡</div>
                        {notification}
                    </div>
                ))}
            </div>
        </div>
    );
};
