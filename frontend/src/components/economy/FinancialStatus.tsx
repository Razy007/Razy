import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiUserProgress } from '../../types';
import { EconomyEngine } from '../../services/EconomyEngine';

interface FinancialStatusProps {
    userProgress: PiUserProgress;
}

export const FinancialStatus: React.FC<FinancialStatusProps> = ({ userProgress }) => {
    const { t } = useTranslation();
    const { economy } = userProgress;
    const tierStatus = EconomyEngine.getWithdrawalCapacity(userProgress);
    const GCV = 314159; // Valeur consensuelle officielle
    
    // Calcul du % vers le prochain niveau de retrait
    const getProgressToNextTier = () => {
        if (economy.withdrawalTier >= 3) return 100;
        
        let nextGoal = 50; // Tier 1
        if (economy.withdrawalTier === 1) nextGoal = 500; // Tier 2
        if (economy.withdrawalTier === 2) nextGoal = 2500; // Tier 3
        
        return Math.min(100, (economy.credibilityScore / nextGoal) * 100);
    };

    return (
        <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🏦</span> 
                        {t('financial.title', 'Statut Financier')}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">{t('financial.merit_economy', 'Économie basée sur le mérite')}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-yellow-400 font-mono">GCV: ${GCV.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">{t('financial.gcv_label', 'Global Consensus Value')}</div>
                </div>
            </div>

            {/* BALANCE CARDS */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* 1. EDUCATIONAL (LOCKED) */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 relative group">
                    <div className="absolute top-2 right-2 text-gray-500">🔒</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t('financial.educ_balance', 'Solde Éducatif (Non-Liquide)')}</div>
                    <div className="text-2xl font-bold text-white font-mono">
                        {economy.balance.toFixed(6)} π
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                        ≈ {(economy.balance * GCV).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} {t('financial.value_hint', '(Valeur Théorique)')}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 w-full p-2 bg-black text-xs text-gray-300 rounded hidden group-hover:block z-10 border border-gray-700">
                        {t('financial.tooltip', "Ce solde sert à apprendre et investir dans l'écosystème. Il n'est pas retirable directement.")}
                    </div>
                </div>

                {/* 2. TRANSFERABLE (REAL) */}
                <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 p-4 rounded-lg border border-yellow-500/50 relative">
                    <div className="absolute top-2 right-2 text-green-400">🔓</div>
                    <div className="text-xs text-yellow-500 uppercase tracking-wider mb-1">{t('financial.real_balance', 'Retirable (Mainnet)')}</div>
                    <div className="text-2xl font-bold text-yellow-400 font-mono">
                        {economy.transferableBalance.toFixed(6)} π
                    </div>
                    <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        ✅ {t('financial.available', 'Disponible')}
                    </div>
                </div>
            </div>

            {/* CREDIBILITY SCORE & TIERS */}
            <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-sm font-semibold text-white">{t('financial.credibility', 'Score de Crédibilité')}</div>
                    <div className="text-sm font-bold text-purple-400">{economy.credibilityScore} pts</div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden relative">
                    <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                        style={{ width: `${getProgressToNextTier()}%` }}
                    ></div>
                    
                    {/* Markers for tiers */}
                    <div className="absolute top-0 left-[10%] w-0.5 h-full bg-black/50" title="Tier 1 (50 pts)"></div>
                    <div className="absolute top-0 left-[50%] w-0.5 h-full bg-black/50" title="Tier 2 (500 pts)"></div>
                </div>
                
                <p className="text-xs text-gray-400 mt-2 text-center">
                    {t('financial.spend_hint', 'Dépensez des Pi dans la boutique pour augmenter votre crédibilité et débloquer les retraits.')}
                </p>
                
                {/* Upgrade Button */}
                <div className="mt-4 flex justify-center">
                    <button 
                        onClick={() => window.location.hash = '#/shop'}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
                    >
                        {t('financial.get_license', 'Obtenir une Licence / Premium')}
                    </button>
                </div>
            </div>

            {/* WITHDRAWAL STATUS */}
            <div className={`p-3 rounded-lg border ${tierStatus.allowed ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                <div className="flex items-center gap-3">
                    <div className={`text-2xl ${tierStatus.allowed ? 'grayscale-0' : 'grayscale'}`}>
                        {tierStatus.allowed ? '🚀' : '🛑'}
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${tierStatus.allowed ? 'text-green-400' : 'text-red-400'}`}>
                            {tierStatus.allowed 
                                ? t('financial.withdraw_allowed', 'Retraits Autorisés') 
                                : t('financial.withdraw_blocked', 'Retraits Bloqués')
                            }
                        </div>
                        <div className="text-xs text-gray-400">
                            {tierStatus.allowed 
                                ? `${t('financial.capacity', 'Capacité')}: ${tierStatus.maxAmount} π / ${t('common.day', 'jour')}`
                                : `${t('financial.reason', 'Raison')}: ${(tierStatus as { reasonKey?: string }).reasonKey ? t('financial.' + (tierStatus as { reasonKey?: string }).reasonKey) : (tierStatus.reason || "Score insuffisant")}`
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 text-[10px] text-gray-600 text-center italic border-t border-gray-800 pt-2">
                {t('financial.disclaimer', "Academy of Pi respecte les règles de l'écosystème Pi Network. La valeur se crée par l'échange, pas par l'accumulation passive.")}
            </div>
        </div>
    );
};
