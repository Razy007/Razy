import React from 'react';
import { QuizQuestion } from '../../types';
import { CheckCircle, XCircle, TrendingUp, Award, BookOpen, Zap, Star, AlertCircle } from 'lucide-react';
import { RetryLimitInfo } from '../../services/RetrySystem';

interface QuizResultsProps {
    questions: QuizQuestion[];
    answers: { question: number; selected: number }[];
    score: number;
    earnedXP: number;
    earnedPi: number;
    piValueUSD: string;
    isPremium: boolean;
    retryInfo?: RetryLimitInfo; // 🔁 Informations de retry optionnelles
    onClose: () => void;
    onRetry: () => void;
    onWatchAd?: () => void; // 📺 Callback pour regarder une pub
}

export const QuizResults: React.FC<QuizResultsProps> = ({
    questions,
    answers,
    score,
    earnedXP,
    earnedPi,
    piValueUSD,
    isPremium,
    retryInfo, // 🔁 Informations de retry
    onClose,
    onRetry,
    onWatchAd
}) => {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 80;
    
    // 🐛 DEBUG: Log pour voir les données reçues
    console.log('📊 QuizResults Debug:');
    console.log('Questions:', questions);
    console.log('Answers:', answers);
    console.log('Score:', score);
    
    // Analyse des compétences par difficulté
    const difficultyStats = questions.reduce((acc, q, idx) => {
        const userAnswer = answers.find(a => a.question === idx);
        // Safety: Ensure both are numbers for comparison
        const isCorrect = userAnswer && Number(userAnswer.selected) === Number(q.correct);
        const diff = q.difficulty || 'medium';
        
        // 🐛 DEBUG DÉTAILLÉ pour identifier l'erreur
        console.log(`
========== Question ${idx + 1} ==========
📋 Texte: ${q.question.substring(0, 50)}...
🎯 Difficulté: ${diff}
✏️  Réponse utilisateur (index): ${userAnswer?.selected} -> "${q.options[userAnswer?.selected] || 'PAS DE RÉPONSE'}"
✅ Bonne réponse (index): ${q.correct} -> "${q.options[q.correct]}"
${isCorrect ? '✅ CORRECT!' : '❌ INCORRECT!'}
====================================
        `);
        
        if (!acc[diff]) {
            acc[diff] = { total: 0, correct: 0 };
        }
        acc[diff].total++;
        if (isCorrect) acc[diff].correct++;
        
        return acc;
    }, {} as Record<string, { total: number; correct: number }>);
    
    // 🔍 VALIDATION AUTOMATIQUE: Vérifier cohérence des statistiques
    const totalQuestionsInStats = Object.values(difficultyStats).reduce((sum, stat) => sum + stat.total, 0);
    const totalCorrectInStats = Object.values(difficultyStats).reduce((sum, stat) => sum + stat.correct, 0);
    
    if (totalQuestionsInStats !== questions.length) {
        console.error(`❌ MISMATCH: Questions count mismatch!`);
        console.error(`Total questions: ${questions.length}, Stats total: ${totalQuestionsInStats}`);
    }
    
    if (totalCorrectInStats !== score) {
        console.error(`❌ MISMATCH: Score mismatch!`);
        console.error(`Score: ${score}, Stats correct: ${totalCorrectInStats}`);
        console.error('Difficulty breakdown:', difficultyStats);
    }
    
    console.log('📈 Difficulty Stats:', difficultyStats);
    console.log(`✅ Validation: ${totalQuestionsInStats}/${questions.length} questions, ${totalCorrectInStats}/${score} correct`);
    
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999] overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl w-full max-w-3xl border border-slate-700 shadow-2xl my-8">
                {/* Header avec badge de performance */}
                <div className={`p-6 rounded-t-2xl text-center ${
                    percentage === 100 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b-2 border-yellow-500'
                        : percentage >= 80
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-b-2 border-green-500'
                        : percentage >= 60
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b-2 border-blue-500'
                        : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b-2 border-red-500'
                }`}>
                    <div className="text-6xl mb-2">
                        {percentage === 100 ? '🏆' : percentage >= 80 ? '⭐' : percentage >= 60 ? '👍' : '📚'}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {percentage === 100 ? 'Parfait !' : percentage >= 80 ? 'Excellent !' : percentage >= 60 ? 'Bien !' : 'Continuez !'}
                    </h2>
                    <div className="text-5xl font-bold text-white mb-2">
                        {score}/{questions.length}
                    </div>
                    <div className="text-2xl text-white/80">
                        {percentage.toFixed(0)}%
                    </div>
                </div>

                {/* Récompenses */}
                <div className="p-6 bg-slate-800/50 border-b border-slate-700">
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <Award size={20} className="text-yellow-400" />
                        Récompenses
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-4">
                            <div className="text-yellow-400 text-sm mb-1">XP Gagnés</div>
                            <div className="text-white text-2xl font-bold">
                                +{earnedXP} XP
                            </div>
                            {isPremium && (
                                <div className="text-purple-400 text-xs mt-1">✨ x2 Premium</div>
                            )}
                            {retryInfo && retryInfo.rewardMultiplier < 1.0 && (
                                <div className="text-orange-400 text-xs mt-1">
                                    ⚠️ Récompenses réduites ({(retryInfo.rewardMultiplier * 100).toFixed(0)}%)
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                            <div className="text-orange-400 text-sm mb-1">Pi Gagnés</div>
                            <div className="text-white text-2xl font-bold">
                                +{earnedPi.toFixed(6)}π
                            </div>
                            <div className="text-slate-400 text-xs mt-1">
                                ~${piValueUSD} USD
                            </div>
                        </div>
                    </div>
                    {passed && (
                        <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                            <div className="text-green-400 font-bold flex items-center justify-center gap-2">
                                <CheckCircle size={18} />
                                ✅ Cours validé ! Vous pouvez passer au suivant.
                            </div>
                        </div>
                    )}
                    {!passed && (
                        <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                            <div className="text-blue-400 font-bold flex items-center justify-center gap-2">
                                <Zap size={18} />
                                💡 Réessayez pour valider le cours (80%+ requis)
                            </div>
                            {retryInfo && retryInfo.currentAttempt > 1 && (
                                <div className="text-blue-300 text-sm mt-2">
                                    Tentative {retryInfo.currentAttempt}
                                    {retryInfo.costXP > 0 && (
                                        <span className="text-orange-400"> • Prochain retry: {retryInfo.costXP} XP</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Analyse des compétences */}
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

                {/* Revue détaillée des questions */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 sticky top-0 bg-slate-800/95 backdrop-blur-sm py-2 -mt-2">
                        <BookOpen size={20} className="text-purple-400" />
                        Revue Détaillée
                    </h3>
                    <div className="space-y-4">
                        {questions.map((question, idx) => {
                            const userAnswer = answers.find(a => a.question === idx);
                            const isCorrect = userAnswer && userAnswer.selected === question.correct;
                            
                            return (
                                <div 
                                    key={idx}
                                    className={`bg-slate-900/50 rounded-lg p-4 border-2 ${
                                        isCorrect 
                                            ? 'border-green-500/30' 
                                            : 'border-red-500/30'
                                    }`}
                                >
                                    {/* En-tête de la question */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`mt-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                            {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-white font-bold text-sm">
                                                    Question {idx + 1}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                    question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                    question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {question.difficulty === 'easy' ? 'Facile' : question.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                                                </span>
                                            </div>
                                            <p className="text-white text-base mb-3">
                                                {question.question}
                                            </p>
                                            
                                            {/* Options */}
                                            <div className="space-y-2 mb-3">
                                                {question.options.map((option, optIdx) => {
                                                    const isUserChoice = userAnswer?.selected === optIdx;
                                                    const isCorrectChoice = optIdx === question.correct;
                                                    
                                                    return (
                                                        <div 
                                                            key={optIdx}
                                                            className={`p-2 rounded-lg text-sm ${
                                                                isCorrectChoice 
                                                                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                                                                    : isUserChoice
                                                                    ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                                                                    : 'bg-slate-800/50 text-slate-400'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold">
                                                                    {String.fromCharCode(65 + optIdx)}.
                                                                </span>
                                                                <span>{option}</span>
                                                                {isCorrectChoice && (
                                                                    <span className="ml-auto text-xs font-bold">✅ Correct</span>
                                                                )}
                                                                {isUserChoice && !isCorrectChoice && (
                                                                    <span className="ml-auto text-xs font-bold">❌ Votre choix</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            
                                            {/* Explication */}
                                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                                <div className="flex items-start gap-2">
                                                    <Star size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <div className="text-blue-400 font-bold text-xs mb-1">
                                                            💡 Explication
                                                        </div>
                                                        <p className="text-blue-300 text-sm">
                                                            {question.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-800/50 rounded-b-2xl flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        Terminer
                    </button>
                    {!passed && (
                        <>
                            {/* Option Publicité (si disponible et coût > 0) */}
                            {onWatchAd && retryInfo && retryInfo.costXP > 0 && !isPremium && retryInfo.canWatchAd && (
                                <button
                                    onClick={onWatchAd}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap size={18} className="fill-yellow-400 text-yellow-400" />
                                    <span>Pub = Gratuit</span>
                                </button>
                            )}
                            
                            {/* Option Standard (XP ou Gratuit sans pub) */}
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
