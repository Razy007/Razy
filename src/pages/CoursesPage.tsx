import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCourses, COURSES } from '../data/courses';
import { Lock, CheckCircle, Play, Trophy, Zap } from 'lucide-react';
import { XPProgressIndicator } from '../components/education/XPProgressIndicator';

interface CoursesPageProps {
  userProgress: any;
  onSelectCourse: (course: any) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ userProgress, onSelectCourse }) => {
  const { t, i18n } = useTranslation();
  const courses = getCourses(i18n.language);

  const getUserMastery = (courseId: string) => {
    const completed = userProgress.completedLayers[courseId] || [];
    const totalLayers = courses.find(c => c.id === courseId)?.layers.length || 1;
    return Math.round((completed.length / totalLayers) * 100);
  };

  const canAccessCourse = (course: any) => {
    // Check level requirement
    if (course.requiredLevel && userProgress.level < course.requiredLevel) {
      return false;
    }
    
    // Check XP requirement
    if (course.requiredXP && userProgress.xp < course.requiredXP) {
      return false;
    }
    
    // Check prerequisite courses
    if (course.requiredCourses && course.requiredCourses.length > 0) {
      return course.requiredCourses.every((prereqId: string) => {
        const mastery = getUserMastery(prereqId);
        return mastery >= 80; // Must have 80%+ mastery
      });
    }
    
    return !course.locked;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{t('nav.courses')}</h2>
        <p className="text-white/70">{t('courses.subtitle', { defaultValue: 'Learn • Earn • Grow with Pi' })}</p>
      </div>

      {/* XP Progress Indicator */}
      <XPProgressIndicator userProgress={userProgress} allCourses={COURSES} />

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => {
          const mastery = getUserMastery(course.id);
          const accessible = canAccessCourse(course);
          const isCompleted = mastery >= 100;

          return (
            <div
              key={course.id}
              onClick={() => accessible && onSelectCourse(course)}
              className={`
                relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 
                ${accessible 
                  ? 'border-white/20 hover:border-yellow-400/50 cursor-pointer hover:scale-105 transition-all' 
                  : 'border-white/10 opacity-60 cursor-not-allowed'
                }
                ${isCompleted ? 'border-green-400/50' : ''}
              `}
            >
              {/* Locked/Completed Overlay */}
              {!accessible && (
                <div className="absolute top-4 right-4 bg-red-500/80 rounded-full p-2">
                  <Lock size={20} className="text-white" />
                </div>
              )}
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-green-500/80 rounded-full p-2">
                  <CheckCircle size={20} className="text-white" />
                </div>
              )}

              {/* Icon */}
              <div className="text-5xl mb-3">{course.icon}</div>

              {/* Title */}
              <h3 className="text-white font-bold text-xl mb-2">{course.title}</h3>

              {/* Description */}
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{course.description}</p>

              {/* Stats Row */}
              <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
                {/* Difficulty Badge */}
                {course.difficulty && (
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1
                    ${course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                    ${course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                    ${course.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : ''}
                    ${course.difficulty === 'expert' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : ''}
                  `}>
                    {course.difficulty === 'beginner' && '🟢'}
                    {course.difficulty === 'intermediate' && '🟡'}
                    {course.difficulty === 'advanced' && '🔴'}
                    {course.difficulty === 'expert' && '🟣'}
                    {course.difficulty === 'beginner' && t('difficulty.beginner', { defaultValue: 'Beginner' })}
                    {course.difficulty === 'intermediate' && t('difficulty.intermediate', { defaultValue: 'Intermediate' })}
                    {course.difficulty === 'advanced' && t('difficulty.advanced', { defaultValue: 'Advanced' })}
                    {course.difficulty === 'expert' && t('difficulty.expert', { defaultValue: 'Expert' })}
                  </span>
                )}
                
                <div className="flex items-center gap-1 text-yellow-400">
                  <Trophy size={14} />
                  <span>{course.totalXp} XP</span>
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <span>+{course.piReward.toFixed(4)}π</span>
                </div>
                {course.premium && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    👑 {t('general.premium')}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {mastery > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>{t('stats.xpDetail')}</span>
                    <span>{mastery}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isCompleted 
                          ? 'bg-green-400' 
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      }`}
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                disabled={!accessible}
                className={`
                  w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                  ${accessible
                    ? isCompleted
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : mastery > 0
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 text-black'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {!accessible ? (
                  <>
                    <Lock size={16} />
                    {t('course.locked')}
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle size={16} />
                    {t('course.completed')}
                  </>
                ) : mastery > 0 ? (
                  <>
                    <Play size={16} />
                    {t('course.continue')}
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    {t('course.start')}
                  </>
                )}
              </button>

              {/* Requirements (if locked) */}
              {!accessible && (
                <div className="mt-3 text-xs text-red-400">
                  {course.requiredLevel > userProgress.level && (
                    <div>🔒 {t('stats.level')} {course.requiredLevel} {t('general.required' || 'requis')}</div>
                  )}
                  {course.requiredXP > userProgress.xp && (
                    <div>🔒 {course.requiredXP} XP {t('general.required' || 'requis')}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Coming Soon - Future Features */}
      <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border-2 border-purple-500/30">
        <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
          🚀 {t('courses.coming_soon', { defaultValue: 'Coming Soon' })}
        </h3>
        <p className="text-white/70 mb-6">
          {t('courses.coming_soon_desc', { defaultValue: 'Exciting new learning experiences in development!' })}
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Feature 1: Simulations */}
          <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition">
            <div className="text-3xl mb-2">🎮</div>
            <h4 className="text-yellow-400 font-bold mb-2">Interactive Simulations</h4>
            <p className="text-white/60 text-sm">
              Practice KYC, Staking, and Wallet Security in safe sandbox environment
            </p>
          </div>

          {/* Feature 2: Case Studies */}
          <div className="bg-black/30 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/50 transition">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="text-yellow-400 font-bold mb-2">Real-World Case Studies</h4>
            <p className="text-white/60 text-sm">
              Analyze actual Pi Network scenarios and make strategic decisions
            </p>
          </div>

          {/* Feature 3: Expert Courses */}
          <div className="bg-black/30 rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/50 transition">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="text-yellow-400 font-bold mb-2">Expert Certifications</h4>
            <p className="text-white/60 text-sm">
              Earn NFT certificates and unlock exclusive advanced content
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            💡 {t('courses.stay_tuned', { defaultValue: 'Stay tuned for updates! New features added regularly.' })}
          </p>
        </div>
      </div>

      {/* Empty State (if no courses) */}
      {courses.length === 0 && (
        <div className="text-center py-12 text-white/50">
          <p className="text-xl">{t('common.loading')}</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
