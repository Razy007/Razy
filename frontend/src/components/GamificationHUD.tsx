import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { 
    Achievement, 
    ComboState, 
    ComboSystem, 
    DailyChallenge,
    ChallengeSystem,
    GamificationEngine,
    ACHIEVEMENTS,
    PROGRESSION_MILESTONES
} from '../services/edu/GamificationSystem';

interface GamificationHUDProps {
    userProgress: UserProgress;
    comboState: ComboState;
    dailyChallenges: DailyChallenge[];
    onPowerUpPurchase?: (powerUpId: string) => void;
}

/**
 * 🎮 GAMIFICATION HUD
 * 
 * Interface utilisateur pour afficher:
 * - Progression en temps réel
 * - Combos et streaks
 * - Achievements débloqués
 * - Défis quotidiens
 * - Leaderboard
 */
export const GamificationHUD: React.FC<GamificationHUDProps> = ({
    userProgress,
    comboState,
    dailyChallenges,
    onPowerUpPurchase
}) => {
    const [showAchievements, setShowAchievements] = useState(false);
    const [showChallenges, setShowChallenges] = useState(false);
    const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

    // Calculer la progression vers le prochain niveau
    const progressToNextLevel = (userProgress.xp / userProgress.xpToNext) * 100;

    // Trouver le prochain milestone
    const nextMilestone = PROGRESSION_MILESTONES.find(m => m.level > userProgress.level);

    // Achievements débloqués
    const unlockedAchievementsCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
    const totalAchievements = ACHIEVEMENTS.length;

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* ========== BARRE DE PROGRESSION PRINCIPALE ========== */}
            <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-3xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-yellow-500/20 transform rotate-3 transition-transform group-hover:rotate-0 duration-500">
                            {userProgress.level}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Niveau Actuel</p>
                            <h3 className="text-2xl font-black text-white tracking-tighter">Pioneer Grade {userProgress.level}</h3>
                        </div>
                    </div>
                    {nextMilestone && (
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-2xl">
                             <span className="text-2xl animate-bounce">{nextMilestone.icon}</span>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Next Goal</p>
                                <p className="text-xs font-black text-yellow-500 uppercase tracking-widest">{nextMilestone.title}</p>
                             </div>
                        </div>
                    )}
                </div>
                
                <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-end mb-1 px-2">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Expérience Accumulée</p>
                        <p className="text-sm font-black text-white/60 tracking-widest">
                            {userProgress.xp.toLocaleString()} <span className="text-white/20">/</span> {userProgress.xpToNext.toLocaleString()} XP
                        </p>
                    </div>
                    <div className="relative h-4 bg-black/20 rounded-full border border-white/5 overflow-hidden shadow-inner">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-yellow-400 to-yellow-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                          style={{ width: `${progressToNextLevel}%` }}
                        >
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-10 relative z-10">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/[0.08] group/stat">
                        <span className="block text-2xl mb-2 group-hover/stat:scale-125 transition-transform">🔥</span>
                        <p className="text-xl font-black text-white">{userProgress.streak}</p>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Jours</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/[0.08] group/stat">
                        <span className="block text-2xl mb-2 group-hover/stat:scale-125 transition-transform">π</span>
                        <p className="text-xl font-black text-yellow-500">{userProgress.piBalance.toFixed(4)}</p>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Solde</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/[0.08] group/stat">
                        <span className="block text-2xl mb-2 group-hover/stat:scale-125 transition-transform">⚡</span>
                        <p className="text-xl font-black text-blue-400">{userProgress.energy.current}/{userProgress.energy.max}</p>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">NRJ</p>
                    </div>
                </div>

                {/* Abstract lighting */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -ml-24 -mb-24" />
            </div>

            {/* ========== COMBO DISPLAY ========== */}
            {comboState.active && comboState.current >= 3 && (
                <div className={`
                  flex items-center gap-8 p-8 rounded-[2rem] border-2 shadow-2xl animate-bounce duration-1000
                  ${comboState.current >= 10 ? 'bg-orange-500/10 border-orange-500/50' : 
                    comboState.current >= 7 ? 'bg-purple-500/10 border-purple-500/50' : 
                    comboState.current >= 5 ? 'bg-blue-500/10 border-blue-500/50' : 'bg-green-500/10 border-green-500/50'}
                `}>
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-5xl shadow-2xl relative">
                        🔥
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-black text-[10px] font-black flex items-center justify-center rounded-lg shadow-lg">X{comboState.current}</div>
                    </div>
                    <div className="flex-1">
                        <div className="text-3xl font-black text-white tracking-tighter truncate">{ComboSystem.getComboLabel(comboState.current)}</div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Multiplicateur Actif</p>
                    </div>
                    <div className="text-3xl font-black text-green-500 tracking-tighter">
                      +{((comboState.multiplier - 1) * 100).toFixed(0)}% <span className="text-[10px] uppercase text-white/20">XP</span>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* ========== DÉFIS QUOTIDIENS ========== */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-fit">
                    <button 
                      className="w-full flex justify-between items-center p-8 bg-white/[0.03] hover:bg-white/5 transition-colors border-b border-white/5"
                      onClick={() => setShowChallenges(!showChallenges)}
                    >
                        <div className="flex items-center gap-4">
                           <span className="text-2xl">🎯</span>
                           <span className="text-sm font-black text-white uppercase tracking-[0.2em]">Missions du Jour</span>
                        </div>
                        <span className={`text-white transition-transform duration-500 ${showChallenges ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    
                    {showChallenges && (
                        <div className="p-8 space-y-6">
                            {dailyChallenges.map(challenge => (
                                <div key={challenge.id} className={`flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 transition-all relative group overflow-hidden ${challenge.completed ? 'opacity-40 grayscale' : 'hover:scale-102 hover:bg-white/10'}`}>
                                    <div className="text-4xl transition-transform group-hover:scale-110 duration-500">{challenge.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-end mb-3 px-1">
                                           <div className="font-black text-white tracking-tight truncate mr-4">{challenge.title}</div>
                                           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none">+{challenge.xpReward} XP</span>
                                        </div>
                                        <div className="relative h-2 bg-black/20 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                            <div 
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700" 
                                                style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 px-1">
                                           <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{challenge.progress} / {challenge.target}</span>
                                           {challenge.completed && <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Validé ✓</span>}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ========== ACHIEVEMENTS ========== */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-fit">
                    <button 
                      className="w-full flex justify-between items-center p-8 bg-white/[0.03] hover:bg-white/5 transition-colors border-b border-white/5"
                      onClick={() => setShowAchievements(!showAchievements)}
                    >
                        <div className="flex items-center gap-4">
                           <span className="text-2xl">🏆</span>
                           <span className="text-sm font-black text-white uppercase tracking-[0.2em]">Archives ({unlockedAchievementsCount}/{totalAchievements})</span>
                        </div>
                        <span className={`text-white transition-transform duration-500 ${showAchievements ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {showAchievements && (
                        <div className="p-8 grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {ACHIEVEMENTS.map(achievement => (
                                <div 
                                    key={achievement.id} 
                                    className={`
                                      group/ach aspect-square flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-500 relative cursor-help
                                      ${achievement.unlocked 
                                        ? 'bg-white/5 border-white/10 opacity-100 hover:scale-110 hover:shadow-2xl' 
                                        : 'bg-black/40 border-white/5 opacity-20 grayscale'
                                      }
                                      ${achievement.rarity === 'legendary' && achievement.unlocked ? 'border-yellow-500/50 shadow-yellow-500/5' : 
                                        achievement.rarity === 'epic' && achievement.unlocked ? 'border-purple-500/50 shadow-purple-500/5' : 
                                        achievement.rarity === 'rare' && achievement.unlocked ? 'border-blue-500/50 shadow-blue-500/5' : 'border-white/5'}
                                    `}
                                    title={achievement.description}
                                >
                                    <div className={`text-3xl mb-2 transition-transform duration-700 ${achievement.unlocked ? 'group-hover/ach:scale-125' : ''}`}>{achievement.icon}</div>
                                    <div className="text-[8px] font-black text-white uppercase tracking-tighter text-center leading-tight">{achievement.title}</div>
                                    
                                    {achievement.unlocked && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-black text-[10px] rounded-full flex items-center justify-center font-black animate-in zoom-in-50 duration-500 shadow-lg">✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ========== NOTIFICATION D'ACHIEVEMENT ========== */}
            {recentAchievement && (
                <div className="fixed top-10 right-10 z-50 animate-in slide-in-from-right-20 fade-in duration-500">
                    <div className="flex items-center gap-8 p-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-[2.5rem] shadow-3xl text-black relative overflow-hidden group">
                        <div className="text-7xl group-hover:scale-110 transition-transform duration-700 relative z-10">{recentAchievement.icon}</div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Nouvel Excellence Archivée</p>
                            <h3 className="text-3xl font-black tracking-tighter mb-4 leading-none">{recentAchievement.title}</h3>
                            <div className="flex gap-4">
                                <span className="px-3 py-1 bg-black/10 rounded-lg text-[10px] font-black uppercase tracking-widest">+{recentAchievement.xpReward} XP</span>
                                <span className="px-3 py-1 bg-black/10 rounded-lg text-[10px] font-black uppercase tracking-widest">+{recentAchievement.piReward} Pi</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    </div>
                </div>
            )}
        </div>
    );
};
