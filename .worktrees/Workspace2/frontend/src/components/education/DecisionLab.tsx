import React, { useState } from 'react';
import { X, Brain, TrendingUp, Award, AlertCircle, CheckCircle, Target, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface DecisionOption {
    id: string;
    text: string;
    impact: {
        reputation?: number;
        xp?: number;
        pi?: number;
    };
    consequences: string;
    isOptimal?: boolean;
    reasoning: string;
}

export interface DecisionScenario {
    id: string;
    title: string;
    context: string;
    situation: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    category: 'dao-governance' | 'security' | 'economics' | 'community' | 'technical' | 'strategy';
    options: DecisionOption[];
    energyCost: number;
    xpReward: number;
    reputationReward: number;
}

interface DecisionLabProps {
    scenario: DecisionScenario;
    onComplete: (optionId: string) => void;
    onClose: () => void;
}

export const DecisionLab: React.FC<DecisionLabProps> = ({ scenario, onComplete, onClose }) => {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const getDifficultyColor = () => {
        switch (scenario.difficulty) {
            case 'easy': return 'from-green-500 to-teal-500';
            case 'medium': return 'from-yellow-500 to-orange-500';
            case 'hard': return 'from-red-500 to-pink-500';
            case 'expert': return 'from-purple-500 to-indigo-500';
        }
    };

    const getDifficultyLabel = () => {
        switch (scenario.difficulty) {
            case 'easy': return '⭐ ' + (t('course.difficulty_easy') || 'Facile');
            case 'medium': return '⭐⭐ ' + (t('course.difficulty_medium') || 'Moyen');
            case 'hard': return '⭐⭐⭐ ' + (t('course.difficulty_hard') || 'Difficile');
            case 'expert': return '⭐⭐⭐⭐ ' + (t('course.difficulty_expert') || 'Expert');
        }
    };

    const getCategoryIcon = () => {
        switch (scenario.category) {
            case 'dao-governance': return '🏛️';
            case 'security': return '🔐';
            case 'economics': return '💰';
            case 'community': return '👥';
            case 'technical': return '⚙️';
            case 'strategy': return '🎯';
        }
    };

    const handleSubmit = () => {
        if (!selectedOption) return;
        setHasSubmitted(true);
        setShowResult(true);
    };

    const handleComplete = () => {
        if (!selectedOption) return;
        onComplete(selectedOption);
    };

    const selectedOptionData = scenario.options.find(opt => opt.id === selectedOption);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
                            <Brain size={32} className="text-purple-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{getCategoryIcon()}</span>
                                <span className={`bg-gradient-to-r ${getDifficultyColor()} bg-clip-text text-transparent font-bold text-sm`}>
                                    {getDifficultyLabel()}
                                </span>
                            </div>
                            <h2 className="text-white text-2xl font-bold">{scenario.title}</h2>
                            <p className="text-purple-300 text-sm">Laboratoire de Décision Cognitive</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition">
                        <X size={28} />
                    </button>
                </div>

                {/* Energy & Rewards Info */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-black/40 rounded-lg p-3 border border-yellow-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={16} className="text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-semibold">Énergie</span>
                        </div>
                        <p className="text-white font-bold text-lg">{scenario.energyCost}⚡</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={16} className="text-blue-400" />
                            <span className="text-blue-400 text-xs font-semibold">XP Potentiel</span>
                        </div>
                        <p className="text-white font-bold text-lg">+{scenario.xpReward}</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Award size={16} className="text-green-400" />
                            <span className="text-green-400 text-xs font-semibold">Réputation</span>
                        </div>
                        <p className="text-white font-bold text-lg">+{scenario.reputationReward}</p>
                    </div>
                </div>

                {/* Context */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-4">
                    <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle size={18} />
                        Contexte
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">{scenario.context}</p>
                </div>

                {/* Situation */}
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-6">
                    <h3 className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                        <Target size={18} />
                        Situation
                    </h3>
                    <p className="text-white font-medium leading-relaxed">{scenario.situation}</p>
                </div>

                {/* Options */}
                <div className="mb-6">
                    <h3 className="text-white font-bold text-lg mb-4">Que décidez-vous ?</h3>
                    <div className="space-y-3">
                        {scenario.options.map((option, index) => {
                            const isSelected = selectedOption === option.id;
                            const showAsOptimal = showResult && option.isOptimal;
                            const showAsSelected = showResult && isSelected;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => !hasSubmitted && setSelectedOption(option.id)}
                                    disabled={hasSubmitted}
                                    className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                                        hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'
                                    } ${
                                        showAsOptimal
                                            ? 'bg-green-500/20 border-green-400'
                                            : showAsSelected && !option.isOptimal
                                            ? 'bg-orange-500/20 border-orange-400'
                                            : isSelected
                                            ? 'bg-purple-500/30 border-purple-400'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                            showAsOptimal
                                                ? 'bg-green-400 text-black'
                                                : showAsSelected && !option.isOptimal
                                                ? 'bg-orange-400 text-black'
                                                : isSelected
                                                ? 'bg-purple-400 text-black'
                                                : 'bg-white/20 text-white'
                                        }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium mb-2">{option.text}</p>
                                            
                                            {/* Show consequences after submission */}
                                            {showResult && (
                                                <div className={`mt-3 p-3 rounded-lg text-sm ${
                                                    option.isOptimal
                                                        ? 'bg-green-500/10 border border-green-400/30'
                                                        : 'bg-orange-500/10 border border-orange-400/30'
                                                }`}>
                                                    <p className={`font-semibold mb-1 ${
                                                        option.isOptimal ? 'text-green-300' : 'text-orange-300'
                                                    }`}>
                                                        {option.isOptimal ? '✅ Décision optimale' : '⚠️ Décision sous-optimale'}
                                                    </p>
                                                    <p className="text-white/80 mb-2">{option.consequences}</p>
                                                    <p className="text-white/60 italic text-xs">💡 {option.reasoning}</p>
                                                    
                                                    {/* Impact badges */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {option.impact.xp && (
                                                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                                +{option.impact.xp} XP
                                                            </span>
                                                        )}
                                                        {option.impact.reputation && (
                                                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                                                                +{option.impact.reputation} Rep
                                                            </span>
                                                        )}
                                                        {option.impact.pi && (
                                                            <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">
                                                                +{option.impact.pi}π
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {showResult && (
                                            <div className="flex-shrink-0">
                                                {option.isOptimal ? (
                                                    <CheckCircle className="text-green-400" size={24} />
                                                ) : isSelected ? (
                                                    <AlertCircle className="text-orange-400" size={24} />
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {!showResult ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-xl"
                        >
                            🧠 Valider ma décision
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl transition shadow-xl flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={20} />
                            Terminer le laboratoire
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
