import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuizQuestion } from '../../types';
import { CheckCircle, XCircle, TrendingUp, Award, BookOpen, Zap, Lightbulb, Wallet } from 'lucide-react';
import { formatPiToUSD } from '../../utils/format';
import { RetryLimitInfo } from '../../services/RetrySystem';

interface QuizResultsProps {
    questions: QuizQuestion[];
    answers: { question: number; selected: number }[];
    score: number;
    earnedXP: number;
    earnedPi: number;
    piValueUSD: string;
    isPremium: boolean;
    retryInfo?: RetryLimitInfo;
    onClose: () => void;
    onRetry: () => void;
    onWatchAd?: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
    questions,
    answers,
    _score,
    earnedXP,
    earnedPi,
    _piValueUSD,
    isPremium,
    retryInfo,
    onClose,
    onRetry,
    onWatchAd
}) => {
    const { t } = useTranslation();
    
    // 🎯 SIMPLE & CLEAR: Map answers to questions ONCE
    const evaluatedAnswers = questions.map((question, questionIndex) => {
        const userAnswer = answers[questionIndex];
        const selectedIndex = userAnswer ? Number(userAnswer.selected) : -1;
        const correctIndex = Number(question.correct);
        const isCorrect = selectedIndex === correctIndex;
        
        return {
            question,
            questionIndex,
            selectedIndex,
            correctIndex,
            isCorrect,
            difficulty: question.difficulty || 'medium'
        };
    });
    
    // 🎯 RE-CALCULATE Everything from evaluated answers to ensure TOTAL consistency
    const totalCorrect = evaluatedAnswers.filter(a => a.isCorrect).length;
    const finalPercentage = (totalCorrect / questions.length) * 100;
    const passed = finalPercentage >= 80;
    
    // Calculate difficulty stats from evaluated answers
    const difficultyStats = evaluatedAnswers.reduce((acc, evaluation) => {
        const diff = evaluation.difficulty;
        if (!acc[diff]) {
            acc[diff] = { total: 0, correct: 0 };
        }
        acc[diff].total++;
        if (evaluation.isCorrect) {
            acc[diff].correct++;
        }
        return acc;
    }, {} as Record<string, { total: number; correct: number }>);
    
    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-[1000] overflow-y-auto pb-safe-area-bottom">
            <div className="bg-[#0b1222] rounded-[3rem] w-full max-w-3xl border border-white/5 shadow-3xl my-8 overflow-hidden">
                {/* Header */}
                <div className={`p-8 md:p-12 text-center relative overflow-hidden ${
                    finalPercentage === 100 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10'
                        : passed
                        ? 'bg-gradient-to-br from-green-500/20 to-blue-500/10'
                        : 'bg-gradient-to-br from-red-500/20 to-slate-900/10'
                }`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
                    
                    <div className="text-5xl md:text-7xl mb-4">
                        {finalPercentage === 100 ? '🏆' : passed ? '⭐' : '📚'}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
                        {finalPercentage === 100 ? t('quiz.perfect') : passed ? t('quiz.excellent') : t('quiz.keep_going')}
                    </h2>
                    <div className="text-6xl md:text-8xl font-black text-white mb-2 tabular-nums">
                        {totalCorrect}/{questions.length}
                    </div>
                    <div className={`text-xl md:text-2xl font-black uppercase tracking-[0.3em] ${passed ? 'text-green-400' : 'text-red-400/60'}`}>
                        {finalPercentage.toFixed(0)}%
                    </div>
                </div>

                {/* Rewards */}
                <div className="p-5 md:p-8 bg-slate-800/30 border-b border-slate-700">
                    <h3 className="text-white/40 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Award size={14} className="text-yellow-400" />
                        Récompenses Débloquées
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                        <div className="bg-slate-900/80 rounded-2xl p-4 md:p-6 border border-white/5 shadow-inner">
                            <div className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-2">Pioneer XP</div>
                            <div className="text-white text-xl md:text-3xl font-black">
                                +{earnedXP}
                            </div>
                            {isPremium && (
                                <div className="text-purple-400 text-[8px] font-black mt-2 uppercase">✨ Multiplicateur Premium</div>
                            )}
                        </div>
                        <div className="bg-slate-900/80 rounded-2xl p-4 md:p-6 border border-white/5 shadow-inner relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                               <TrendingUp size={48} className="text-green-400" />
                           </div>
                            <div className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Wallet size={12} />
                                Gaming Wallet Gain
                            </div>
                            <div className="text-white text-xl md:text-3xl font-black tabular-nums">
                                +{earnedPi.toFixed(7)}<span className="text-yellow-500 ml-1">π</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-green-400 text-[9px] md:text-[11px] font-black uppercase tracking-tighter">
                                    ≈ {formatPiToUSD(earnedPi)} USD
                                </span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span className="text-white/20 text-[9px] uppercase font-black">Transfert Direct</span>
                            </div>
                        </div>
                    </div>
                    {passed && (
                        <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                            <div className="text-green-400 font-bold flex items-center justify-center gap-2">
                                <CheckCircle size={18} />
                                ✅ {t('course.completed')} !
                            </div>
                        </div>
                    )}
                </div>

                {/* Difficulty Stats */}
                <div className="p-6 bg-slate-800/50 border-b border-slate-700">
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-400" />
                        Analyse des Compétences
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(difficultyStats).map(([difficulty, stats]) => {
                            const percent = (stats.correct / stats.total) * 100;
                            return (
                                <div key={difficulty} className="bg-slate-900/50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                                difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {difficulty === 'easy' ? 'Facile' : difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                                            </span>
                                            <span className="text-white text-sm">
                                                {stats.correct}/{stats.total} correct
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold ${
                                            percent === 100 ? 'text-green-400' :
                                            percent >= 50 ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                            {percent.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all ${
                                                percent === 100 ? 'bg-green-500' :
                                                percent >= 50 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detailed Review */}
                <div className="p-8 max-h-[50vh] overflow-y-auto bg-black/20">
                    <h3 className="text-white font-black text-xl mb-8 flex items-center gap-3 sticky top-0 bg-[#0b1222]/95 backdrop-blur-md py-4 z-10">
                        <BookOpen size={24} className="text-purple-400" />
                        Revue Détaillée
                    </h3>
                    <div className="space-y-8 pb-10">
                        {evaluatedAnswers.map((evaluation) => {
                            const { question, questionIndex, selectedIndex, correctIndex, isCorrect } = evaluation;
                            
                            return (
                                <div 
                                    key={questionIndex}
                                    className={`bg-white/[0.02] rounded-[2rem] p-6 md:p-8 border-2 transition-all ${
                                        isCorrect 
                                            ? 'border-green-500/10 hover:border-green-500/20' 
                                            : 'border-red-500/10 hover:border-red-500/20'
                                    }`}
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`mt-1 shrink-0 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                            {isCorrect ? <CheckCircle size={28} /> : <XCircle size={28} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">
                                                    Question {questionIndex + 1}
                                                </span>
                                            </div>
                                            <p className="text-white text-lg md:text-xl font-bold leading-tight">
                                                {question.question}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid gap-3 mb-6 ml-10">
                                        {question.options.map((option, optIdx) => {
                                            const isUserChoice = optIdx === selectedIndex;
                                            const isCorrectChoice = optIdx === correctIndex;
                                            
                                            return (
                                                <div 
                                                    key={optIdx}
                                                    className={`p-4 rounded-2xl text-xs md:text-sm flex items-center gap-4 transition-all ${
                                                        isCorrectChoice 
                                                            ? 'bg-green-500/10 border border-green-500/20 text-green-200'
                                                            : isUserChoice
                                                            ? 'bg-red-500/10 border border-red-500/20 text-red-200'
                                                            : 'bg-white/5 text-white/40 border border-white/5'
                                                    }`}
                                                >
                                                    <span className="font-black opacity-30">{String.fromCharCode(65 + optIdx)}.</span>
                                                    <span className="font-bold flex-1">{option}</span>
                                                    {isCorrectChoice && <span className="text-[8px] font-black uppercase bg-green-500 text-black px-2 py-1 rounded">Correct</span>}
                                                    {isUserChoice && !isCorrectChoice && <span className="text-[8px] font-black uppercase bg-red-500 text-white px-2 py-1 rounded">Échec</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {question.explanation && (
                                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 ml-10">
                                            <div className="flex items-start gap-3">
                                                <Lightbulb size={18} className="text-blue-400 mt-1 shrink-0" />
                                                <div>
                                                    <div className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-1">
                                                        Analyse de l&apos;expert
                                                    </div>
                                                    <p className="text-blue-200/70 text-sm leading-relaxed italic">
                                                        &quot;{question.explanation}&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-800/50 rounded-b-2xl flex gap-3 pb-safe-area-bottom">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        Terminer
                    </button>
                    {!passed && (
                        <>
                            {onWatchAd && retryInfo && retryInfo.costXP > 0 && !isPremium && retryInfo.canWatchAd && (
                                <button
                                    onClick={onWatchAd}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap size={18} className="fill-yellow-400 text-yellow-400" />
                                    <span>Pub = Gratuit</span>
                                </button>
                            )}
                            
                            <button
                                onClick={onRetry}
                                className={`flex-1 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
                                    retryInfo && !retryInfo.canRetry 
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                                }`}
                                disabled={retryInfo && !retryInfo.canRetry}
                            >
                                <Zap size={18} />
                                {retryInfo && retryInfo.costXP > 0 ? `-${retryInfo.costXP} XP` : 'Réessayer'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
