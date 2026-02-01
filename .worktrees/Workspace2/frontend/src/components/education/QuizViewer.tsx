import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle, Clock, Zap, Target, ArrowRight } from 'lucide-react';
import { QuizQuestion, Layer, UserProgress } from '../../types';
import { QuizResults } from './QuizResults';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ApiService } from '../../services/ApiService';
import { useAuth } from '../../context/AuthContext';
import { getRandomQuestions } from '../../data/questionBank';

interface QuizViewerProps {
    layer: Layer;
    userProgress: Partial<UserProgress>;
    onComplete: (score: number, answers: { question: number; selected: number }[]) => void;
    onClose: () => void;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({ layer, userProgress, onComplete, onClose }) => {
    const { t, i18n } = useTranslation();
    const { updateProgressSync } = useAuth();
    
    // 1️⃣ STATE & DATA
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ question: number; selected: number }[]>([]);
    
    const getBaseTimer = useCallback(() => {
        if (layer.type === 'mastery' || layer.id.includes('l4') || layer.id.includes('l5')) return 15;
        if (layer.type === 'application' || layer.id.includes('l3')) return 20;
        return 30; // Beginner/Comprehension
    }, [layer.type, layer.id]);

    const [timer, setTimer] = useState(getBaseTimer()); 
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const currentEnergy = userProgress?.energyBalance ?? 0;

    // INTELLIGENT QUESTION COUNT
    const questionCount = (layer.type === 'quiz' || layer.id.includes('l5')) ? 10 : 5;

    // Fetch FRESH random questions to avoid repetition
    const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
        const lang = (i18n.language || 'en').split('-')[0] as 'fr' | 'en';
        try {
            const freshQuestions = getRandomQuestions(layer.id, questionCount, lang);
            if (freshQuestions && freshQuestions.length > 0) {
                return freshQuestions;
            }
        } catch (e) {
            console.warn("Failed to fetch fresh questions", e);
        }
        if (layer?.questions && layer.questions.length > 0) {
            return [...layer.questions].sort(() => Math.random() - 0.5).slice(0, questionCount);
        }
        return [];
    });

    useEffect(() => {
        const lang = (i18n.language || 'en').split('-')[0] as 'fr' | 'en';
        try {
            const freshQuestions = getRandomQuestions(layer.id, questionCount, lang);
            if (freshQuestions && freshQuestions.length > 0) {
                setQuestions(freshQuestions);
            }
        } catch (e) {
            console.warn("Update questions failed", e);
        }
    }, [layer.id, i18n.language, questionCount]);

    const getTypeLabel = () => {
        switch (layer.type) {
            case 'comprehension': return t('course.quiz', 'Compréhension');
            case 'quiz': return t('course.quiz', 'Quiz');
            default: return t('course.quiz', 'Quiz');
        }
    };
    
    // 2️⃣ COOLDOWN SYSTEM
    const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
    const cooldownKey = `cooldown_${layer.id}`;
    const attemptsKey = `attempts_${layer.id}`;

    useEffect(() => {
        const checkCooldown = () => {
            const backendAttempts = userProgress?.quizAttempts?.[layer.id];
            if (backendAttempts?.cooldownUntil) {
                const remaining = Math.ceil((backendAttempts.cooldownUntil - Date.now()) / 1000);
                if (remaining > 0) {
                    setCooldownRemaining(remaining);
                    localStorage.setItem(cooldownKey, backendAttempts.cooldownUntil.toString());
                    return;
                }
            }

            const expiry = localStorage.getItem(cooldownKey);
            if (expiry) {
                const remaining = Math.ceil((parseInt(expiry) - Date.now()) / 1000);
                if (remaining > 0) {
                    setCooldownRemaining(remaining);
                } else {
                    localStorage.removeItem(cooldownKey);
                    localStorage.setItem(attemptsKey, '0');
                    setCooldownRemaining(0);
                }
            }
        };

        checkCooldown();
        const interval = setInterval(checkCooldown, 1000);
        return () => clearInterval(interval);
    }, [layer.id, attemptsKey, cooldownKey, userProgress]);

    // 3️⃣ HANDLERS
    const handleStart = async () => {
        if (cooldownRemaining > 0 || isStarting) return;

        setIsStarting(true);
        try {
            if (layer.energyCost > currentEnergy) {
                toast.error(t('alerts.insufficient_energy', "Pas assez d'énergie !"));
                setIsStarting(false);
                return;
            }

            if (layer.energyCost > 0) {
                 updateProgressSync(0, 0, layer.energyCost);
                 const isGuest = userProgress?.uid?.startsWith('guest_') || !localStorage.getItem('pi_user')?.includes('"accessToken"');
                 if (!isGuest) {
                    try {
                        const response = await ApiService.consumeEnergy(layer.energyCost);
                        if (response.data && !response.data.success && response.data.error === 'COOLDOWN_ACTIVE') {
                             toast.error(t('alerts.cooldown_active', "Cooldown actif sur le serveur."));
                             if (response.data.cooldownUntil) {
                                localStorage.setItem(cooldownKey, response.data.cooldownUntil.toString());
                             }
                             setIsStarting(false);
                             return;
                        }
                    } catch (e) {
                        console.warn("Backend energy sync failed, continuing in local mode", e);
                    }
                 }
            }
            
            const currentAttempts = parseInt(localStorage.getItem(attemptsKey) || '0') + 1;
            localStorage.setItem(attemptsKey, currentAttempts.toString());
            
            if (currentAttempts === 3) {
                 toast.error(t('alerts.cooldown_warning', 'Dernier essai avant pause de réflexion !'), {
                    icon: '⚠️',
                    duration: 5000
                });
            }

            setHasStarted(true);
        } catch (error: unknown) {
            console.error("Quiz Start Error", error);
            toast.error("Erreur au lancement du quiz");
        } finally {
            setIsStarting(false);
        }
    };

    const handleNext = useCallback(() => {
        if (questions.length === 0) return;

        const isCorrect = selectedOption !== null && selectedOption === Number(questions[currentIndex].correct);
        const newScore = isCorrect ? score + 1 : score;
        if (isCorrect) setScore(newScore);
        
        const newAnswers = [...answers, { question: currentIndex, selected: selectedOption ?? -1 }];
        setAnswers(newAnswers);
        
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setTimer(getBaseTimer());
        } else {
            const finalScorePercent = (newScore / questions.length) * 100;
            const currentAttempts = parseInt(localStorage.getItem(attemptsKey) || '0');

            if (finalScorePercent >= 90) {
                localStorage.setItem(attemptsKey, '0');
                localStorage.removeItem(cooldownKey);
            } else if (currentAttempts >= 3) {
                const expiry = Date.now() + 20 * 60 * 1000;
                localStorage.setItem(cooldownKey, expiry.toString());
            }
            setShowResults(true);
        }
    }, [questions, currentIndex, selectedOption, score, answers, attemptsKey, cooldownKey, getBaseTimer]);

    const handleFinish = async () => {
        const finalScore = (score / questions.length) * 100;
        onComplete(finalScore, answers);
    };

    useEffect(() => {
        if (!hasStarted || showResults) return;
        
        if (timer > 0) {
            const timeout = setTimeout(() => setTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timeout);
        } else {
            if (selectedOption !== null) {
                handleNext();
            } else {
                const newAnswers = [...answers, { question: currentIndex, selected: -1 }];
                setAnswers(newAnswers);
                
                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setSelectedOption(null);
                    setTimer(getBaseTimer());
                } else {
                    const finalScorePercent = (score / questions.length) * 100;
                    if (finalScorePercent >= 90) {
                        localStorage.setItem(attemptsKey, '0');
                        localStorage.removeItem(cooldownKey);
                    }
                    setShowResults(true);
                }
            }
        }
    }, [timer, hasStarted, showResults, handleNext, answers, currentIndex, questions, score, attemptsKey, cooldownKey, selectedOption, getBaseTimer]);

    // 4️⃣ RENDERING
    if (hasStarted && questions.length === 0 && !isStarting) {
        return (
            <div className="fixed inset-0 h-[100dvh] bg-slate-950 z-[9999] flex flex-col items-center justify-center p-8 text-white">
                <AlertCircle size={64} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Aucune question disponible</h2>
                <p className="text-slate-400 mb-6 text-center">Ce quiz semble vide ou mal configuré.</p>
                <button onClick={onClose} className="bg-slate-800 px-6 py-2 rounded-lg text-white font-bold">Fermer</button>
            </div>
        );
    }

    if (showResults) {
        const finalScorePercent = questions.length > 0 ? (score / questions.length) * 100 : 0;
        const totalBaseXP = layer.xpReward || 50;
        const earnedXP = Math.max(Math.ceil(0.1 * totalBaseXP), Math.ceil((finalScorePercent / 100) * totalBaseXP));
        
        const basePiUnit = 0.000001; 
        const complexityBonus = layer.id.includes('lab') ? 0.000001 : (layer.id.includes('l2') || layer.id.includes('l3') ? 0.0000005 : 0);
        const potentialPi = basePiUnit + complexityBonus;
        const performanceMultiplier = finalScorePercent >= 90 ? 1 : (finalScorePercent >= 70 ? 0.4 : 0);
        const earnedPi = performanceMultiplier * potentialPi;

        return (
            <QuizResults 
                questions={questions}
                answers={answers}
                score={score}
                earnedXP={earnedXP}
                earnedPi={earnedPi}
                piValueUSD="0.00"
                isPremium={false}
                onClose={handleFinish}
                onRetry={() => {
                    setHasStarted(false);
                    setShowResults(false);
                    setCurrentIndex(0);
                    setAnswers([]);
                    setScore(0);
                    const lang = (i18n.language || 'en').split('-')[0] as 'fr' | 'en';
                    let freshQuestions: QuizQuestion[] = [];
                    try {
                        freshQuestions = getRandomQuestions(layer.id, questionCount, lang);
                    } catch (e) {
                         console.warn("Retry shuffle failed");
                    }

                    if (freshQuestions && freshQuestions.length > 0) {
                        setQuestions(freshQuestions);
                    } else {
                        const baseQuestions = layer.questions || [];
                        setQuestions([...baseQuestions].sort(() => Math.random() - 0.5).slice(0, questionCount));
                    }
                }}
            />
        );
    }

    if (!hasStarted) {
        const minutes = Math.floor(cooldownRemaining / 60);
        const seconds = cooldownRemaining % 60;

        return (
            <div className="fixed inset-0 h-[100dvh] bg-slate-950 z-[9999] flex flex-col items-center justify-center p-4 md:p-8 animate-fadeIn overflow-hidden pb-safe-area-bottom">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-600/10 blur-[120px] rounded-full" />

                <div className="max-w-xl w-full bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl text-center relative z-10">
                    <AnimatePresence>
                        {cooldownRemaining > 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl z-30 flex flex-col items-center justify-center p-8 rounded-[3rem]"
                            >
                                <Clock size={48} className="text-yellow-500 mb-6 animate-pulse" />
                                <h2 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter text-center">{t('alerts.cooldown_title')}</h2>
                                <p className="text-slate-400 text-lg mb-10 leading-relaxed text-center">{t('alerts.cooldown_desc')}</p>
                                <div className="bg-yellow-500 text-black px-12 py-6 rounded-3xl font-black text-5xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                                    {minutes}:{seconds < 10 ? '0' : ''}{seconds}
                                </div>
                                <button onClick={onClose} className="mt-12 text-white/40 hover:text-white font-black uppercase text-[10px] tracking-[0.4em] transition-all">
                                    {t('common.close')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="inline-flex bg-yellow-500/10 p-5 rounded-[2.2rem] border border-yellow-500/20 mb-10">
                        <Target size={36} className="text-yellow-500" />
                    </div>
                    
                    <div className="space-y-4 mb-12">
                        <span className="text-yellow-500 text-[11px] font-black uppercase tracking-[0.3em]">{getTypeLabel()}</span>
                        <h2 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tighter">{layer.title}</h2>
                        <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed">{layer.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mb-12">
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            <Clock size={22} className="text-yellow-500/60 mx-auto mb-3" />
                            <p className="text-white text-2xl font-black">{getBaseTimer()}s</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Chrono</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            <Target size={22} className="text-blue-500/60 mx-auto mb-3" />
                            <p className="text-white text-2xl font-black">{questionCount}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Questions</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 pb-20 md:pb-0">
                        <button 
                            onClick={handleStart}
                            disabled={isStarting || cooldownRemaining > 0}
                            className="w-full bg-white text-black font-black py-6 rounded-2xl text-xl hover:scale-[1.03] active:scale-95 transition-all shadow-3xl disabled:opacity-20 flex items-center justify-center gap-4"
                        >
                            {isStarting ? <Zap className="animate-spin" size={24} /> : <span>{t('course.start_test')}</span>}
                        </button>
                        
                        <div className="flex items-center justify-center gap-3 text-slate-600 text-[11px] font-black uppercase tracking-[0.2em]">
                            <Zap size={14} fill="currentColor" className={currentEnergy >= layer.energyCost ? 'text-yellow-500' : 'text-red-500'} />
                            <span>COÛT : {layer.energyCost} Énergie</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex] || { question: "Loading...", options: [], id: "temp" };

    return (
        <div className="fixed inset-0 h-[100dvh] bg-[#060a15] z-[9999] flex flex-col animate-fadeIn text-white overflow-hidden pb-safe-area-bottom">
            <div className="p-4 md:p-10 flex justify-between items-center shrink-0 z-20">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={onClose} className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
                        <X className="w-4.5 h-4.5 md:w-5 md:h-5" />
                    </button>
                    <div className="min-w-0">
                         <span className="text-yellow-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] block mb-0.5">
                            Question {currentIndex + 1} / {questions.length}
                         </span>
                         <h2 className="text-sm md:text-base font-bold text-white/50 truncate max-w-[120px] md:max-w-md uppercase tracking-tighter">{layer.title}</h2>
                    </div>
                </div>

                <div className={`px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border-2 flex items-center gap-2 md:gap-3 font-mono font-black transition-all ${
                    timer < 10 ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-white/5 border-white/5 text-white/80'
                }`}>
                    <Clock className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                    <span className="text-lg md:text-xl tabular-nums">{timer}s</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-32 md:pb-24 scrollbar-hide">
                <div className="max-w-3xl mx-auto">
                    <div className="w-full h-1 md:h-1.5 bg-white/5 rounded-full mb-8 md:mb-16 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                        />
                    </div>

                    <div className="space-y-8 md:space-y-12">
                        <motion.h3 
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-xl md:text-4xl lg:text-5xl font-black font-heading leading-tight text-white tracking-tight break-words"
                        >
                            {currentQuestion.question}
                        </motion.h3>

                        <div className="grid gap-3 md:gap-6">
                            {currentQuestion.options.map((option: string, idx: number) => (
                                <motion.button
                                    key={`${currentIndex}-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedOption(idx)}
                                    className={`w-full text-left p-4 md:p-8 lg:p-10 rounded-2xl md:rounded-[2.5rem] border-2 transition-all duration-300 flex items-center gap-4 md:gap-6 relative group overflow-hidden ${
                                        selectedOption === idx
                                        ? 'bg-white border-white text-black scale-[1.01] shadow-2xl'
                                        : 'bg-white/[0.03] border-white/5 hover:border-white/10 text-slate-300'
                                    }`}
                                >
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-[1.2rem] flex items-center justify-center font-black text-sm md:text-lg shrink-0 transition-all ${
                                        selectedOption === idx ? 'bg-black text-white' : 'bg-white/5 text-white/20'
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-base md:text-xl lg:text-2xl font-bold leading-snug md:leading-tight flex-1 tracking-tight break-words">{option}</span>
                                    {selectedOption === idx && <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-3xl -mr-16 -mt-16" />}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe-area-bottom md:p-10 bg-gradient-to-t from-[#060a15] via-[#060a15]/95 to-transparent backdrop-blur-md shrink-0 flex items-center justify-center z-50">
                <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className="w-full max-w-xl bg-yellow-500 text-black font-black py-4 md:py-6 rounded-xl md:rounded-2xl text-lg md:text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-3xl shadow-yellow-500/10 disabled:opacity-20 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                >
                    <span>{currentIndex < questions.length - 1 ? t('common.next') : t('common.finish')}</span>
                    <ArrowRight className="w-5 h-5 md:w-5.5 md:h-5.5 opacity-60" />
                </button>
            </div>
        </div>
    );
};
