import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { stakingService, Stake } from '../services/staking';
import { Coins, Clock, Lock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STAKING_PLANS = [
    { period: 7, apy: 2, label: 'Starter', color: 'from-blue-500 to-cyan-400' },
    { period: 30, apy: 8, label: 'Explorer', color: 'from-purple-500 to-pink-400' },
    { period: 90, apy: 15, label: 'Pioneer', color: 'from-amber-500 to-orange-400', popular: true },
    { period: 180, apy: 20, label: 'Investor', color: 'from-emerald-500 to-teal-400' },
    { period: 365, apy: 25, label: 'Whale', color: 'from-rose-500 to-red-400' },
];

const StakingPage: React.FC = () => {
    const { user, refreshProfile } = useAuth();
    const [stakes, setStakes] = useState<Stake[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadStakes();
    }, []);

    const loadStakes = async () => {
        try {
            const myStakes = await stakingService.getMyStakes();
            setStakes(myStakes);
        } catch (error) {
            console.error('Failed to load stakes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStake = async () => {
        if (!selectedPlan || !amount) return;
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Invalid amount');
            return;
        }

        const currentBalance = user?.userProgress?.economy?.transferableBalance || user?.userProgress?.piBalance || 0;

        if (numAmount > currentBalance) {
            toast.error('Insufficient transferable balance');
            return;
        }

        setIsSubmitting(true);
        try {
            await stakingService.createStake(numAmount, selectedPlan);
            toast.success('Staking successful! Funds locked.');
            setAmount('');
            setSelectedPlan(null);
            await loadStakes();
            if (refreshProfile) await refreshProfile();
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || 'Staking failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClaim = async (stakeId: string) => {
        if (!confirm('Are you sure you want to withdraw? A 5% service fee applies.')) return;

        try {
            await stakingService.claimStake(stakeId);
            toast.success('Funds withdrawn successfully!');
            await loadStakes();
            if (refreshProfile) await refreshProfile();
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || 'Withdrawal failed');
        }
    };

    const getExitDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString();
    };

    const isReadyToClaim = (dateStr: string) => {
        return new Date() >= new Date(dateStr);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* Header */}
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center sm:justify-start gap-3">
                    <Lock className="w-8 h-8 text-amber-400" />
                    Pi Staking Vault
                </h1>
                <p className="text-slate-400">Lock your Pi to earn high yields. Secure and automated.</p>
            </div>

            {/* Balance Card */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-sm">
                <div>
                    <p className="text-slate-400 text-sm">Available for Staking (Transferable)</p>
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-500" />
                        {(user?.userProgress?.economy?.transferableBalance || user?.userProgress?.piBalance || 0).toFixed(7)}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-sm">Total Staked</p>
                    <div className="text-2xl font-bold text-amber-400 flex items-center gap-2 justify-end">
                        <Lock className="w-5 h-5" />
                        {(user?.userProgress?.stakingBalance || 0).toFixed(7)}
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Choose a Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                {STAKING_PLANS.map((plan) => (
                    <div 
                        key={plan.period}
                        onClick={() => setSelectedPlan(plan.period)}
                        className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-300 ${
                            selectedPlan === plan.period 
                            ? 'bg-slate-700/80 border-amber-400 transform -translate-y-1 shadow-lg shadow-amber-900/20' 
                            : 'bg-slate-800/40 border-slate-700 hover:bg-slate-700/60 hover:border-slate-500'
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold px-3 py-1 rounded-full text-white shadow-lg">
                                POPULAR
                            </div>
                        )}
                        <div className={`h-1 w-12 rounded-full mb-3 bg-gradient-to-r ${plan.color}`} />
                        <h3 className="text-lg font-bold text-white mb-1">{plan.label}</h3>
                        <div className="text-2xl font-bold text-emerald-400 mb-2">{plan.apy}% <span className="text-xs text-slate-500">APY</span></div>
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <Clock className="w-4 h-4" />
                            {plan.period} Days
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Area */}
            {selectedPlan && (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-12 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-white mb-4">Deposit to {STAKING_PLANS.find(p => p.period === selectedPlan)?.label} Plan</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="w-full sm:w-auto flex-grow">
                            <label className="block text-sm text-slate-400 mb-1">Amount to Lock (Pi)</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                placeholder="Min 1.0 Pi"
                            />
                        </div>
                        <button 
                            onClick={handleStake}
                            disabled={isSubmitting || !amount}
                            className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-white transition-all ${
                                isSubmitting || !amount
                                ? 'bg-slate-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-900/30 transform hover:-translate-y-0.5'
                            }`}
                        >
                            {isSubmitting ? 'Locking...' : 'Lock Funds'}
                        </button>
                    </div>
                    <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-900/50 p-3 rounded border border-slate-800">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                        <p>Funds will be locked for {selectedPlan} days. Early withdrawal is NOT possible. A 5% service fee applies on the total amount (Principal + Reward) upon withdrawal.</p>
                    </div>
                </div>
            )}

            {/* Active Stakes List */}
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                Your Active Stakes
            </h2>
            
            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading your vault...</div>
            ) : stakes.length === 0 ? (
                <div className="bg-slate-800/30 rounded-xl p-8 text-center border border-slate-700 border-dashed">
                    <p className="text-slate-400">You don&apos;t have any active stakes yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {stakes.map((stake) => {
                        const ready = isReadyToClaim(stake.endDate);
                        return (
                            <div key={stake.id} className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ready ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
                                        {ready ? <CheckCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white flex items-center gap-2">
                                            {stake.amount.toFixed(2)} Pi
                                            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">{stake.apy}% APY</span>
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            Unlocks: {getExitDate(stake.endDate)} ({stake.period} days)
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-right mr-4">
                                        <div className="text-xs text-slate-500">Est. Reward</div>
                                        {/* Simple estimation presentation */}
                                        <div className="font-mono text-emerald-400">+{((stake.amount * stake.apy / 100) * (stake.period / 365)).toFixed(3)} Pi</div>
                                    </div>
                                    
                                    {ready ? (
                                        <button 
                                            onClick={() => handleClaim(stake.id)}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all"
                                        >
                                            Withdraw
                                        </button>
                                    ) : (
                                        <button disabled className="px-4 py-2 bg-slate-700 text-slate-500 rounded-lg font-bold text-sm cursor-not-allowed flex items-center gap-2">
                                            <Lock className="w-3 h-3" /> Locked
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StakingPage;
