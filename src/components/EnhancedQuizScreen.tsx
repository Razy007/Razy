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
        
        setSelectedAnswer(answerIndex);
        setShowExplanation(true);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answerIndex === currentQuestion.correct;

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
        } else {
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
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Génération de questions adaptées à votre niveau...</p>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="enhanced-quiz-screen">
            {/* Gamification HUD */}
            <GamificationHUD
                userProgress={userProgress}
                comboState={comboState}
                dailyChallenges={dailyChallenges}
                onPowerUpPurchase={handlePowerUpPurchase}
            />

            {/* Quiz Container */}
            <div className="quiz-container">
                {/* Progress Bar */}
                <div className="quiz-progress">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </span>
                </div>

                {/* Question Card */}
                <div className="question-card">
                    <div className="question-header">
                        <span className="difficulty-badge difficulty-{currentQuestion.difficulty}">
                            {currentQuestion.difficulty.toUpperCase()}
                        </span>
                        <span className="topic-badge">{currentQuestion.topic}</span>
                    </div>

                    <h2 className="question-text">{currentQuestion.question}</h2>

                    {/* Options */}
                    <div className="options-grid">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-button ${
                                    selectedAnswer === index
                                        ? index === currentQuestion.correct
                                            ? 'correct'
                                            : 'incorrect'
                                        : ''
                                } ${
                                    showExplanation && index === currentQuestion.correct
                                        ? 'highlight-correct'
                                        : ''
                                }`}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={selectedAnswer !== null}
                            >
                                <span className="option-letter">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="option-text">{option}</span>
                            </button>
                        ))}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                        <div className="explanation-box">
                            <h3>💡 Explication</h3>
                            <p>{currentQuestion.explanation}</p>
                            
                            <button className="next-button" onClick={handleNextQuestion}>
                                {currentQuestionIndex < questions.length - 1 
                                    ? 'Question Suivante →' 
                                    : 'Terminer le Quiz 🎉'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Score Display */}
                <div className="score-display">
                    <div className="score-item">
                        <span className="score-label">Score</span>
                        <span className="score-value">
                            {score.correct}/{score.total}
                        </span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Précision</span>
                        <span className="score-value">
                            {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                        </span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">Récompenses</span>
                        <span className="score-value">
                            {totalRewards.xp} XP | {totalRewards.pi.toFixed(4)} Pi
                        </span>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="notifications-container">
                {notifications.map((notification, index) => (
                    <div key={index} className="notification-toast">
                        {notification}
                    </div>
                ))}
            </div>

            <style>{`
                .enhanced-quiz-screen {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    padding: 20px;
                }

                .loading-screen {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    color: white;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-top-color: #8b5cf6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .quiz-container {
                    max-width: 800px;
                    margin: 20px auto;
                }

                .quiz-progress {
                    position: relative;
                    height: 40px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 20px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #8b5cf6, #3b82f6);
                    transition: width 0.3s ease;
                }

                .progress-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: bold;
                }

                .question-card {
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 20px;
                }

                .question-header {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .difficulty-badge,
                .topic-badge {
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: bold;
                }

                .difficulty-easy { background: #10b981; color: white; }
                .difficulty-medium { background: #3b82f6; color: white; }
                .difficulty-hard { background: #8b5cf6; color: white; }
                .difficulty-expert { background: #f59e0b; color: white; }

                .topic-badge {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .question-text {
                    color: white;
                    font-size: 20px;
                    margin-bottom: 24px;
                }

                .options-grid {
                    display: grid;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .option-button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .option-button:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .option-button.correct {
                    background: rgba(16, 185, 129, 0.2);
                    border-color: #10b981;
                }

                .option-button.incorrect {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                }

                .option-button.highlight-correct {
                    background: rgba(16, 185, 129, 0.2);
                    border-color: #10b981;
                }

                .option-letter {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    font-weight: bold;
                }

                .explanation-box {
                    background: rgba(139, 92, 246, 0.1);
                    border: 2px solid #8b5cf6;
                    border-radius: 12px;
                    padding: 20px;
                    margin-top: 20px;
                }

                .explanation-box h3 {
                    color: white;
                    margin-bottom: 12px;
                }

                .explanation-box p {
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.6;
                    margin-bottom: 16px;
                }

                .next-button {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .next-button:hover {
                    transform: scale(1.02);
                }

                .score-display {
                    display: flex;
                    gap: 16px;
                    justify-content: space-around;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                    padding: 16px;
                }

                .score-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .score-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 4px;
                }

                .score-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: white;
                }

                .notifications-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    z-index: 1000;
                }

                .notification-toast {
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                    border-radius: 8px;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    animation: slideInRight 0.3s ease;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};
