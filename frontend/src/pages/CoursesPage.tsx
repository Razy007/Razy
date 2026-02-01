import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { getCourses } from '../data/courses';
import { Lock, CheckCircle, Play, Trophy, Zap } from 'lucide-react';
import { Card, Button as BaseButton } from '../components/BaseComponents';
import { LayerSelector } from '../components/education/LayerSelector';
import { LayerViewer } from '../components/education/LayerViewer';
import { Layer, Course, UserProgress, PiUserProgress } from '../types';
import { toast } from 'react-hot-toast';
import { ApiService } from '../services/ApiService';
import { formatPiToUSD } from '../utils/format';

// ---------------------------------------------------------------------
// 1. MEMOIZED CHILD COMPONENT: CourseCard
// ---------------------------------------------------------------------
interface CourseCardProps {
  course: Course;
  mastery: number;
  accessible: boolean;
  isCompleted: boolean;
  lockReason?: string;
  onSelect: () => void;
}

const CourseCard_Inner = ({ course, mastery, accessible, isCompleted, lockReason, onSelect }: CourseCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      onClick={() => accessible && onSelect()}
      className={`
        relative group transition-all duration-500 p-0 overflow-hidden flex flex-col h-full
        ${accessible 
          ? 'cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-yellow-500/5 hover:-translate-y-2 hover:border-white/20' 
          : 'opacity-50 grayscale-[0.8]'
        }
        ${isCompleted ? 'border-green-500/30' : ''}
      `}
    >
      <div className={`h-1.5 ${
        isCompleted ? 'bg-green-500' : 
        course.difficulty === 'beginner' ? 'bg-green-400' :
        course.difficulty === 'intermediate' ? 'bg-yellow-400' :
        course.difficulty === 'advanced' ? 'bg-orange-500' : 'bg-purple-600'
      }`} />

      <div className="p-8 flex flex-col flex-grow relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="text-5xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out">{course.icon}</div>
          <div className="flex items-center gap-2">
            {!accessible && <div className="bg-white/5 p-2 rounded-xl text-white/20 border border-white/5"><Lock size={18} /></div>}
            {isCompleted && <div className="bg-green-500/10 p-2 rounded-xl text-green-500 border border-green-500/20"><CheckCircle size={18} /></div>}
          </div>
        </div>

        <div className="space-y-4 mb-8 flex-grow relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-yellow-400 transition-colors uppercase">{course.title}</h3>
            {course.premium && (
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg shadow-purple-500/20">
                Premium
              </span>
            )}
          </div>
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-medium">{course.description}</p>
        </div>

        <div className="flex items-center gap-3 mb-8 flex-wrap relative z-10">
          <span className={`
            px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border
            ${course.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
            ${course.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
            ${course.difficulty === 'advanced' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
            ${course.difficulty === 'expert' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
          `}>
            {t(`difficulty.${course.difficulty || 'beginner'}`)}
          </span>
          
          <div className="flex items-center gap-1.5 text-yellow-500 bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
            <Trophy size={14} className="text-yellow-500" />
            <span>{course.totalXp} XP</span>
          </div>
        </div>

        {mastery > 0 && (
          <div className="mb-8 space-y-3 relative z-10">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              <span>{t('stats.mastery', 'Maîtrise')}</span>
              <span className={isCompleted ? 'text-green-400' : 'text-white'}>{mastery}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.3)]'
                }`}
                style={{ width: `${mastery}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onSelect}
          disabled={!accessible}
          className={`
            w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] relative z-10
            ${accessible
              ? isCompleted
                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                : mastery > 0
                ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-xl shadow-yellow-500/20'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
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
              {t('common.completed')}
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
        
        {/* 🔒 Show lock reason if course is not accessible */}
        {!accessible && lockReason && (
          <div className="mt-4 text-center text-[10px] text-white/40 font-medium">
            🔒 {lockReason}
          </div>
        )}
      </div>
    </Card>
  );
};

CourseCard_Inner.propTypes = {
  course: PropTypes.object.isRequired,
  mastery: PropTypes.number.isRequired,
  accessible: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};

const CourseCard = React.memo(CourseCard_Inner);
CourseCard.displayName = 'CourseCard';


// ---------------------------------------------------------------------
// 2. MAIN COMPONENT
// ---------------------------------------------------------------------
interface CoursesPageProps {
  onSelectLayer?: (layer: Layer) => void;
}

interface ProcessedCourse extends Course {
  mastery: number;
  accessible: boolean;
  isCompleted: boolean;
  lockReason?: string; // Human-readable reason why course is locked
}

const CoursesPage_Base: React.FC<CoursesPageProps> = ({ onSelectLayer }) => {
  const { t, i18n } = useTranslation();
  const { user, refreshProfile, updateProgressSync, markCourseAsCompleted } = useAuth();
  
  const [selectedCourseIdForLayers, setSelectedCourseIdForLayers] = useState<string | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null); 
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        await refreshProfile().catch(() => {});
        const localData = getCourses(i18n.language);
        setCourses(localData);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [i18n.language, refreshProfile]);

  const selectedLayer = useMemo(() => {
    if (!selectedLayerId || !currentCourseId) return null;
    const course = courses.find((c: Course) => c.id === currentCourseId);
    return course?.layers.find((l: Layer) => l.id === selectedLayerId) || null;
  }, [courses, selectedLayerId, currentCourseId]);

  const handleLayerComplete = useCallback(async (data?: { score: number }) => {
    if (!selectedLayerId) return;

    try {
        const rawXp = selectedLayer?.xpReward || 50;
        const currentScoreValue = data?.score !== undefined ? data.score : 100;
        const isQuiz = selectedLayer?.type === 'quiz' || selectedLayer?.type === 'comprehension';
        
        // XP is always earned (even 10% for participation)
        const xpObtained = Math.max(Math.ceil(0.1 * rawXp), Math.ceil((currentScoreValue / 100) * rawXp));
        
        // Pi Gain only if excellent score
        const piGain = currentScoreValue >= 90 ? 0.00001 : (currentScoreValue >= 70 ? 0.000004 : 0);
        
        // COMPLETION LOGIC: Only counts if 90%+ for quizzes, or always for discovery/labs
        const isActuallyPassed = !isQuiz || currentScoreValue >= 90;

        if (isActuallyPassed) {
            toast.success(`+${xpObtained} XP ${t('common.earned', 'gagnés !')} - Layer Mastered!`);
            updateProgressSync(xpObtained, piGain, 0, selectedLayerId, currentCourseId || undefined);
            
            // 🎓 CHECK IF ENTIRE COURSE IS NOW COMPLETED
            if (currentCourseId) {
                const currentCourse = courses.find(c => c.id === currentCourseId);
                if (currentCourse) {
                    const allLayerIds = currentCourse.layers.map(l => l.id);
                    const userCompletedLayers = user?.userProgress?.completedLayers?.[currentCourseId] || [];
                    
                    // Include the layer we just completed (might not be in userCompletedLayers yet)
                    const completedSet = new Set([...userCompletedLayers, selectedLayerId]);
                    
                    // Check if all layers are now completed
                    const allLayersCompleted = allLayerIds.every(layerId => completedSet.has(layerId));
                    
                    if (allLayersCompleted) {
                        console.log(`[CoursesPage] 🎓 All ${allLayerIds.length} layers completed for course: ${currentCourseId}`);
                        markCourseAsCompleted(currentCourseId);
                        toast.success(`🎓 ${t('course.completed', 'Cours terminé !')} - ${currentCourse.title}`, { duration: 5000 });
                    } else {
                        console.log(`[CoursesPage] Layer completed. Progress: ${completedSet.size}/${allLayerIds.length} layers.`);
                    }
                }
            }
        } else {
            toast.error(`${t('course.failed', 'Échec')} (${currentScoreValue}%). Score min: 90% pour valider.`);
            // Still give XP for effort, but don't pass layerId/courseId so it's not marked as completed
            updateProgressSync(xpObtained, 0, 0); 
        }

        if (user && !user.uid.startsWith('guest_')) {
            try {
                // Backend still tracks the attempt
                await ApiService.updateProgress(selectedLayerId, currentScoreValue, currentCourseId as string);
                setTimeout(() => refreshProfile(), 1000);
            } catch (err) {
                console.error("Backend sync failed", err);
            }
        }
    } catch (err) {
        console.error("Error updating progress:", err);
    } finally {
        const lastCourseId = currentCourseId;
        setSelectedLayerId(null);
        setCurrentCourseId(null);
        if (lastCourseId) setSelectedCourseIdForLayers(lastCourseId);
    }
  }, [selectedLayerId, selectedLayer, user, refreshProfile, updateProgressSync, markCourseAsCompleted, t, currentCourseId, courses]);

  const processedCourses = useMemo((): ProcessedCourse[] => {
    const progress: PiUserProgress = user?.userProgress || { 
        level: 1, 
        xp: 0, 
        cumulatedXP: 0, 
        completedLayers: {},
        piBalance: 0,
        economy: {
            balance: 0,
            transferableBalance: 0,
            lifetimeEarnings: 0,
            lifetimeSpent: 0,
            credibilityScore: 0,
            withdrawalTier: 0,
            pendingWithdrawals: 0
        },
        inventory: []
    };
    const layerProgressMap: Record<string, string[]> = progress.completedLayers || {};
    
    // 🔍 DEBUG: Log progress state
    console.log('[CoursesPage] User Progress Debug:', {
        level: progress.level,
        cumulatedXP: progress.cumulatedXP,
        completedCourses: progress.completedCourses || [],
        completedLayersKeys: Object.keys(layerProgressMap),
        layerProgressMap
    });

    if (!Array.isArray(courses)) return [];

    return courses.map((course: Course) => {
      if (!course) return null;

      const completed = layerProgressMap[course.id] || [];
      const layers = course.layers || [];
      const totalLayers = layers.length > 0 ? layers.length : 1;
      
      const mastery = Math.round((completed.length / totalLayers) * 100);
      const isCompleted = mastery >= 100 || (progress.completedCourses || []).includes(course.id);

      let accessible = true;
      const lockReasons: string[] = [];
      const userLevel = progress.level || 1;
      const userXP = progress.cumulatedXP || 0;

      // Check Level requirement
      if (course.requiredLevel && userLevel < course.requiredLevel) {
          accessible = false;
          lockReasons.push(`Niveau ${course.requiredLevel} requis (actuel: ${userLevel})`);
      }
      
      // Check XP requirement
      if (course.requiredXP && userXP < course.requiredXP) {
          accessible = false;
          lockReasons.push(`${course.requiredXP} XP requis (actuel: ${userXP})`);
      }
      
      // LICENSE/ITEM CHECK (Paywall)
      const requiredItem = course.requiredItem;
      if (requiredItem) {
          const hasItem = progress.inventory?.some((item) => item.itemId === requiredItem || item.id === requiredItem);
          if (!hasItem) {
              accessible = false;
              lockReasons.push(`Licence Premium requise`);
          }
      }

      // Check prerequisite courses
      const requiredCourses = course.requiredCourses || [];
      if (requiredCourses.length > 0) {
          const missingPrereqs: string[] = [];
          
          requiredCourses.forEach((reqId: string) => {
              // CHECK 1: Is this course in completedCourses array?
              const isInCompletedCourses = (progress.completedCourses || []).includes(reqId);
              if (isInCompletedCourses) {
                  console.log(`[CoursesPage] ✅ Prereq ${reqId} found in completedCourses`);
                  return; // This prereq is met
              }
              
              // CHECK 2: Fallback to layer mastery check (90% threshold for flexibility)
              const reqCourse = courses.find(c => c && c.id === reqId);
              if (!reqCourse) return; // Unknown course, consider met
              
              const completedInCourse = layerProgressMap[reqId] || [];
              const reqTotalLayers = reqCourse.layers?.length || 1;
              const courseMastery = (completedInCourse.length / reqTotalLayers) * 100;
              
              console.log(`[CoursesPage] Prereq ${reqId}: ${completedInCourse.length}/${reqTotalLayers} layers = ${courseMastery}%`);
              
              // ✅ FIX: Use 90% threshold instead of 100% to allow for edge cases
              // Also mark as completed if mastery >= 90%
              if (courseMastery >= 90) {
                  console.log(`[CoursesPage] ✅ Prereq ${reqId} met via layer mastery (${courseMastery}%)`);
                  return; // This prereq is met
              }
              
              // If not 90%+ mastered, add to missing prereqs
              missingPrereqs.push(reqCourse.title);
          });
          
          if (missingPrereqs.length > 0) {
              accessible = false;
              lockReasons.push(`Terminer: ${missingPrereqs.join(', ')}`);
          }
      }
      
      const lockReason = lockReasons.length > 0 ? lockReasons.join(' • ') : undefined;
      
      console.log(`[CoursesPage] Course ${course.id}: mastery=${mastery}%, accessible=${accessible}, isCompleted=${isCompleted}, lockReason=${lockReason || 'none'}`);

      return { ...course, layers, mastery, accessible, isCompleted, lockReason } as ProcessedCourse;
    }).filter((c): c is ProcessedCourse => c !== null);
  }, [user, courses]);

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Standardize progress for sub-components
  const currentProgressRaw = user?.userProgress || { 
    level: 1, 
    xp: 0, 
    cumulatedXP: 0, 
    piBalance: 0, 
    completedLayers: {} 
  };
  const currentProgress = currentProgressRaw as unknown as UserProgress;
  const currentPiBalance = (currentProgressRaw as PiUserProgress).piBalance || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 pt-4 md:pt-8">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          {t('course.title_prefix', 'Parcours')} <span className="text-yellow-500">{t('course.title_suffix', 'Pionnier')}</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          {t('course.subtitle', 'Maîtrise de l\'écosystème Pi étape par étape.')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
         {[
           { key: 'all', label: t('course.tags.all', 'Tous') },
           { key: 'beginner', label: t('difficulty.beginner', 'Débutant') },
           { key: 'security', label: t('course.tags.security', 'Sécurité') },
           { key: 'finance', label: t('course.tags.finance', 'Finance') },
           { key: 'web3', label: t('course.tags.web3', 'Web3') }
         ].map((tag, i) => (
           <button key={tag.key} className={`px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${
             i === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 border border-white/10 text-white/40'
           }`}>
             {tag.label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
        {processedCourses.map((data: ProcessedCourse) => (
          <div key={data.id} className="w-full max-w-sm">
            <CourseCard
              course={data}
              mastery={data.mastery}
              accessible={data.accessible}
              isCompleted={data.isCompleted}
              lockReason={data.lockReason}
              onSelect={() => setSelectedCourseIdForLayers(data.id)}
            />
          </div>
        ))}
      </div>

      {selectedCourseIdForLayers && (
        <LayerSelector
          course={courses.find(c => c.id === selectedCourseIdForLayers)!}
          userProgress={currentProgress}
          onSelectLayer={(layer) => {
            setCurrentCourseId(selectedCourseIdForLayers);
            setSelectedLayerId(layer.id);
            setSelectedCourseIdForLayers(null);
            if (onSelectLayer) onSelectLayer(layer);
          }}
          onClose={() => setSelectedCourseIdForLayers(null)}
        />
      )}

      {selectedLayer && (
        <LayerViewer
          layer={selectedLayer}
          userProgress={currentProgress}
          onComplete={handleLayerComplete}
          onClose={() => {
            setSelectedLayerId(null);
            setCurrentCourseId(null);
          }}
        />
      )}

      <Card className="bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-black/40 backdrop-blur-3xl p-8 md:p-14 text-white relative overflow-hidden border-white/10 shadow-3xl rounded-[3rem] mt-16">
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left">
               <div className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
                  {t('course.accelerate', 'ACCÉLÉRATEUR DE GAINS')}
               </div>
               <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    {t('course.cta_title', 'Prêt pour le niveau supérieur ?')}
               </h3>
               <p className="text-indigo-200/60 text-lg max-w-xl font-medium leading-relaxed">
                    {t('course.cta_desc', 'Chaque cours complété augmente votre réputation et débloque de nouveaux gains.')}
               </p>
            </div>
            <div className="flex flex-col gap-6 w-full lg:w-auto min-w-[300px]">
               <div className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center shadow-2xl relative group overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">{t('course.accumulated_gains', 'Gains Accumulés')}</p>
                  <p className="text-6xl font-black text-white flex items-center justify-center gap-3">
                    {currentPiBalance.toFixed(7)} <span className="text-yellow-500">π</span>
                  </p>
                  <div className="flex flex-col items-center mt-4">
                    <p className="text-[10px] font-black text-green-400 tracking-[0.3em] uppercase bg-green-400/10 px-3 py-1 rounded-full mb-2">
                       ≈ {formatPiToUSD(currentPiBalance)} USD
                    </p>
                  </div>
               </div>
               <BaseButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} variant="premium" className="w-full py-6">
                  {t('course.continue_mobile', 'Continuer l\'Apprentissage')}
               </BaseButton>
            </div>
         </div>
      </Card>
    </div>
  );
};

CoursesPage_Base.propTypes = {
  onSelectLayer: PropTypes.func
};

const CoursesPage = React.memo(CoursesPage_Base);
CoursesPage.displayName = 'CoursesPage';

export default CoursesPage;
