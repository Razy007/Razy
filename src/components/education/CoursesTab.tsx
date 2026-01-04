import React from 'react';
import { Book, ChevronRight, Target } from 'lucide-react';
import { COURSES } from '../../data/courses';
import ProgressionSystem from '../../services/ProgressionSystem';
import { CourseCard } from './CourseCard';
import { XPProgressIndicator } from './XPProgressIndicator';
import { Course } from '../../types';

interface CoursesTabProps {
  userProgress: any;
  onSelectCourse: (course: Course) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ userProgress, onSelectCourse }) => {
  // Organize courses by category with unlock status
  const organized = ProgressionSystem.organizeCoursesByCategory(COURSES, userProgress);
  
  return (
    <div className="space-y-8 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-3xl font-bold flex items-center gap-3">
          <Book size={32} className="text-yellow-400" />
          Cours Disponibles
        </h2>
        <div className="text-white/60 text-sm">
          <span className="text-yellow-400 font-bold">Niveau {userProgress.level}</span> • {userProgress.totalPoints} XP
        </div>
      </div>
      
      {/* XP Progress Indicator */}
      <XPProgressIndicator userProgress={userProgress} allCourses={COURSES} />
      
      {/* Courses by Category */}
      {Array.from(organized.entries()).map(([category, coursesData]) => (
        <div key={category} className="mb-8">
          <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
            <ChevronRight size={24} className="text-yellow-400" />
            {category}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursesData.map(({ course, unlockStatus, progress }) => (
              <CourseCard
                key={course.id}
                course={course}
                unlockStatus={unlockStatus}
                progress={progress}
                onSelect={() => {
                  if (unlockStatus.isUnlocked) {
                    onSelectCourse(course);
                  } else {
                    alert(`🔒 Cours verrouillé\n\n${unlockStatus.reason}\n\nContinuez votre progression pour le débloquer!`);
                  }
                }}
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Recommended Course */}
      {(() => {
        const recommended = ProgressionSystem.recommendNextCourse(COURSES, userProgress);
        if (recommended) {
          const recommendedProgress = ProgressionSystem.calculateCourseProgress(recommended, userProgress);
          return (
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-xl p-6 mt-8">
              <h3 className="text-yellow-400 font-bold text-xl mb-2 flex items-center gap-2">
                <Target size={24} />
                💡 Recommandé pour vous
              </h3>
              <p className="text-white mb-4">Continue ta progression avec ce cours:</p>
              <CourseCard
                course={recommended}
                unlockStatus={{ isUnlocked: true }}
                progress={recommendedProgress}
                onSelect={() => onSelectCourse(recommended)}
              />
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};
