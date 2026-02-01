import React from 'react';
import { Lock, TrendingUp, Award, Crown, CheckCircle } from 'lucide-react';
import { Course } from '../../types';
import ProgressionSystem, { UnlockStatus } from '../../services/ProgressionSystem';

interface CourseCardProps {
    course: Course;
    unlockStatus: UnlockStatus;
    progress: number;
    onSelect: () => void;
}

const DifficultyBadge: React.FC<{ difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert' }> = ({ difficulty }) => {
    if (!difficulty) return null;
    
    const config = {
        beginner: { label: '⭐ Débutant', gradient: 'from-green-500 to-teal-500' },
        intermediate: { label: '⭐⭐ Intermédiaire', gradient: 'from-yellow-500 to-orange-500' },
        advanced: { label: '⭐⭐⭐ Avancé', gradient: 'from-red-500 to-pink-500' },
        expert: { label: '⭐⭐⭐⭐ Expert', gradient: 'from-purple-500 to-indigo-500' }
    };
    
    const { label, gradient } = config[difficulty];
    
    return (
        <div className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold text-xs`}>
            {label}
        </div>
    );
};

export const CourseCard: React.FC<CourseCardProps> = ({ 
    course, 
    unlockStatus, 
    progress, 
    onSelect 
}) => {
    const isLocked = !unlockStatus.isUnlocked;
    const { level, xp, courses: prereqCourses } = unlockStatus.requirements || {};
    
    return (
        <div 
            className={`
                relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm
                rounded-xl p-6 border-2 transition-all duration-300
                ${isLocked 
                    ? 'opacity-70 border-red-400/30 cursor-not-allowed' 
                    : 'border-green-400/30 hover:border-yellow-400/50 hover:scale-[1.02] cursor-pointer hover:shadow-xl'
                }
            `}
            onClick={() => !isLocked && onSelect()}
        >
            {/* Difficulty Badge */}
            <div className="absolute top-4 right-4">
                <DifficultyBadge difficulty={course.difficulty} />
            </div>
            
            {/* Lock Icon */}
            {isLocked && (
                <div className="absolute top-4 left-4 text-red-400 animate-pulse">
                    <Lock size={24} />
                </div>
            )}
            
            {/* Completion Badge */}
            {progress === 100 && (
                <div className="absolute top-4 left-4 text-green-400">
                    <CheckCircle size={24} />
                </div>
            )}
            
            {/* Course Info */}
            <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl flex-shrink-0">{course.icon}</div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-lg mb-1 truncate">{course.title}</h4>
                    <p className="text-purple-300 text-sm line-clamp-2">{course.description}</p>
                </div>
            </div>
            
            {/* Progress Bar (if started and unlocked) */}
            {!isLocked && progress > 0 && progress < 100 && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white/60 text-xs">Progression</span>
                        <span className="text-yellow-400 text-xs font-bold">{progress}%</span>
                    </div>
                    <div className="bg-black/30 rounded-full h-2 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
            
            {/* Completion Badge */}
            {progress === 100 && (
                <div className="mb-4 bg-green-500/20 border border-green-400/30 rounded-lg p-2 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-green-300 text-sm font-semibold">✓ Cours terminé!</span>
                </div>
            )}
            
            {/* Unlock Requirements (if locked) */}
            {isLocked && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 space-y-2 mb-4">
                    <p className="text-red-300 font-semibold text-sm mb-3 flex items-center gap-2">
                        <Lock size={16} />
                        Prérequis pour débloquer:
                    </p>
                    
                    {level && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                level.current >= level.required ? 'bg-green-400 text-black' : 'bg-red-400 text-white'
                            }`}>
                                {level.current >= level.required ? '✓' : '✗'}
                            </div>
                            <span className="text-white/80">
                                Niveau {level.required} <span className="text-white/50">(Actuel: {level.current})</span>
                            </span>
                        </div>
                    )}
                    
                    {xp && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                xp.current >= xp.required ? 'bg-green-400 text-black' : 'bg-red-400 text-white'
                            }`}>
                                {xp.current >= xp.required ? '✓' : '✗'}
                            </div>
                            <span className="text-white/80">
                                {xp.required} XP total <span className="text-white/50">(Actuel: {xp.current})</span>
                            </span>
                        </div>
                    )}
                    
                    {prereqCourses && prereqCourses.required.length > 0 && (
                        <div className="text-sm">
                            <div className="text-white/80 mb-2">Cours prérequis:</div>
                            {prereqCourses.required.map((courseId, idx) => {
                                const isCompleted = prereqCourses.completed.includes(courseId);
                                // Try to find course name (simple approach)
                                const courseName = courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                return (
                                    <div key={courseId} className="flex items-center gap-2 ml-4 mb-1">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                            isCompleted ? 'bg-green-400 text-black' : 'bg-red-400 text-white'
                                        }`}>
                                            {isCompleted ? '✓' : idx + 1}
                                        </div>
                                        <span className={isCompleted ? 'text-green-300' : 'text-white/60'}>
                                            {courseName}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {/* Unlock Token Option (future feature) */}
                    <div className="pt-2 mt-2 border-t border-red-400/20">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                alert('🔓 Unlock Tokens bientôt disponibles dans la boutique!\n\nDébloquez n\'importe quel cours instantanément avec un token.');
                            }}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-2 px-4 rounded-lg hover:scale-105 transition text-sm flex items-center justify-center gap-2"
                        >
                            <Lock size={16} />
                            Débloquer avec Token (Bientôt)
                        </button>
                    </div>
                </div>
            )}
            
            {/* Rewards */}
            <div className="flex items-center flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-blue-300">
                    <TrendingUp size={16} />
                    <span className="font-semibold">{course.totalXp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-300">
                    <Award size={16} />
                    <span className="font-semibold">{course.piReward}π</span>
                </div>
                {course.premium && (
                    <div className="flex items-center gap-1.5 text-purple-300">
                        <Crown size={16} />
                        <span className="font-semibold">Premium</span>
                    </div>
                )}
                {!isLocked && progress === 0 && (
                    <div className="text-green-400 text-xs font-semibold ml-auto">
                        ▶ Commencer
                    </div>
                )}
                {!isLocked && progress > 0 && progress < 100 && (
                    <div className="text-yellow-400 text-xs font-semibold ml-auto">
                        ▶ Continuer
                    </div>
                )}
            </div>
        </div>
    );
};
