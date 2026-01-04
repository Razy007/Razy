import React from 'react';
import { TrendingUp, Lock, Zap } from 'lucide-react';
import { UserProgress, Course } from '../../types';
import { ProgressionSystem } from '../../services/ProgressionSystem';

interface XPProgressIndicatorProps {
    userProgress: UserProgress;
    allCourses: Course[];
}

export const XPProgressIndicator: React.FC<XPProgressIndicatorProps> = ({ userProgress, allCourses }) => {
    const currentXP = userProgress.xp;
    const currentLevel = userProgress.level;
    const xpToNext = userProgress.xpToNext || 100;
    
    // XP pour passer au niveau suivant
    const nextLevelXP = currentLevel * 100;
    const currentLevelXP = (currentLevel - 1) * 100;
    const progressInLevel = currentXP - currentLevelXP;
    const progressPercentage = (progressInLevel / 100) * 100;
    
    // Trouver les prochains cours débloqués
    const nextUnlocks = allCourses
        .filter(course => !ProgressionSystem.isCourseUnlocked(course, userProgress))
        .slice(0, 3) // Top 3 prochains
        .map(course => {
            const req = course.unlockRequirements;
            const missing: string[] = [];
            
            if (req.requiredLevel && currentLevel < req.requiredLevel) {
                const levelsNeeded = req.requiredLevel - currentLevel;
                const xpNeeded = levelsNeeded * 100 + xpToNext;
                missing.push(`Niveau ${req.requiredLevel} (${xpNeeded} XP)`);
            }
            
            return {
                course,
                missing: missing[0] || 'Bientôt disponible'
            };
        });

    return (
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-4 border border-purple-500/30">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-yellow-400" />
                    <h3 className="text-white font-bold">Progression</h3>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">Niv.{currentLevel}</div>
                    <div className="text-xs text-purple-300">{currentXP.toLocaleString()} XP</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-purple-300 mb-1">
                    <span>Niveau {currentLevel}</span>
                    <span className="text-yellow-400 font-bold">{xpToNext} XP restants</span>
                    <span>Niveau {currentLevel + 1}</span>
                </div>
                <div className="bg-black/30 rounded-full h-3 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-full transition-all duration-500 relative"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
                <div className="text-center text-xs text-purple-300 mt-1">
                    {progressInLevel}/100 XP ({progressPercentage.toFixed(0)}%)
                </div>
            </div>

            {/* Next Unlocks */}
            {nextUnlocks.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Lock size={14} className="text-blue-400" />
                        <h4 className="text-white text-sm font-semibold">Prochains débloqués</h4>
                    </div>
                    <div className="space-y-2">
                        {nextUnlocks.map(({ course, missing }) => (
                            <div 
                                key={course.id}
                                className="bg-black/20 rounded-lg p-2 flex items-center gap-3"
                            >
                                <div className="text-2xl">{course.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-white text-sm font-medium truncate">{course.title}</div>
                                    <div className="text-blue-400 text-xs flex items-center gap-1">
                                        <Zap size={10} />
                                        {missing}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-purple-500/20">
                <div className="text-center">
                    <div className="text-yellow-400 text-lg font-bold">{userProgress.piBalance.toFixed(4)}</div>
                    <div className="text-purple-300 text-xs">Pi Earned</div>
                </div>
                <div className="text-center">
                    <div className="text-green-400 text-lg font-bold">{userProgress.completedCourses.length}</div>
                    <div className="text-purple-300 text-xs">Courses Done</div>
                </div>
                <div className="text-center">
                    <div className="text-blue-400 text-lg font-bold">{userProgress.streak || 0}</div>
                    <div className="text-purple-300 text-xs">Day Streak</div>
                </div>
            </div>
        </div>
    );
};
