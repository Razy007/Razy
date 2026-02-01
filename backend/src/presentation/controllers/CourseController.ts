import { Request, Response } from 'express';
import { EnrichedCourse, LayerContent } from '../../domain/entities/CourseContent';
import { enrichedCourseExamples } from '../../data/enrichedCourseExamples';
import { RESTORED_COURSES } from '../../data/restored_courses';

export class CourseController {
  constructor() {}

  /**
   * Get all courses (Enriched format)
   * FALLBACK: Uses restored static data if DB is empty or connection fails
   */
  public getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('[CourseController] Fetching courses...');
      
      // Try DB first (optional), but for restoration request we FORCE legacy data
      // const rawCourses = await this.courseRepository.findAll(); 
      
      // USE RESTORED DATA
      const rawCourses = RESTORED_COURSES;
      console.log(`[CourseController] Using ${rawCourses.length} restored courses.`);

      // Determine language (default fr)
      // const lang = req.query.lang as string || 'fr';

      // Normalisation
      const courses = rawCourses.map(item => this.normalizeToCourse(item));
      
      res.json({
        success: true,
        data: courses,
        count: courses.length
      });
    } catch (error: any) {
      console.error('[CourseController] Error fetching courses:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch courses',
        message: error.message
      });
    }
  };

  /**
   * GET /api/courses/:courseId
   * Retourne un cours spécifique par son ID (propriété id ou courseId)
   */
  public getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;
      const rawCourses = Object.values(enrichedCourseExamples) as any[];
      
      // Recherche par propriété ID réelle
      const rawItem = rawCourses.find(item => {
        if (item && typeof item === 'object' && 'id' in item) return item.id === courseId; 
        if (item && typeof item === 'object' && 'courseId' in item) return item.courseId === courseId; 
        return false;
      });
      
      if (!rawItem) {
        res.status(404).json({
          success: false,
          error: 'Course not found',
          courseId
        });
        return;
      }

      const course = this.normalizeToCourse(rawItem);

      res.json({
        success: true,
        data: course
      });
    } catch (error: any) {
      console.error('[CourseController] Error fetching course:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch course',
        message: error.message
      });
    }
  };

  /**
   * Helper pour convertir LayerContent en structure compatible Course
   */
  private normalizeToCourse(item: any): any {
    // Helper pour s'assurer qu'une layer a un bon ID pour le frontend
    const normalizeLayer = (l: any) => {
      // Mapping Simulation -> InteractiveData pour SmartLabViewer
      let interactiveData = undefined;
      if (l.simulation) {
        interactiveData = {
            initialState: `**Simulation Active:** ${l.title}\n\n${l.description}`,
            actions: l.simulation.interactionPoints?.map((p: any) => ({
                id: p.id,
                label: p.label,
                feedback: p.feedback,
                feedbackType: 'positive', // Default
                energyCost: 10, // Default cost
                consequence: { xpChange: 10 }
            })) || []
        };
      }

      // Mapping Video/CaseStudy -> DiscoveryContent pour DiscoveryViewer
      let discoveryContent = undefined;
      if (l.video || l.caseStudy || l.contentType === 'video' || l.contentType === 'case_study') {
         discoveryContent = {
            type: l.contentType === 'case_study' ? 'case-study' : 'video',
            title: l.title,
            description: l.description,
            content: l.markdown || l.description,
            visualUrl: l.video?.url,
            duration: l.video?.duration ? Math.ceil(l.video.duration/60) + ' min' : undefined,
            highlights: l.learningObjectives || []
         };
      }

      return {
        ...l,
        id: l.id || l.layerId, // Frontend attend 'id'
        title: l.title,
        description: l.description,
        type: l.type || l.contentType || 'discovery', // Mapping essentiel: contentType -> type
        interactiveData: interactiveData || l.interactiveData, // Mapping pour Lab
        discoveryContent: discoveryContent || l.discoveryContent, // Mapping pour Discovery
        duration: l.duration || l.estimatedDuration,
        xpReward: l.xpReward,
        energyCost: l.energyCost,
        content: l.content // Legacy fallback
      };
    };

    // Si c'est déjà un EnrichedCourse (a une propriété 'layers')
    if ('layers' in item) {
       // On re-map les layers existantes aussi pour être sûr
       return {
         ...item,
         layers: (item.layers || []).map(normalizeLayer)
       };
    }

    // Sinon, c'est une LayerContent isolée, on la wrapper
    const normalizedLayer = normalizeLayer(item);
    
    return {
      id: item.courseId || item.layerId, // ID stable pour le frontend
      title: item.title,
      description: item.description,
      category: 'Education', // Valeur défaut
      difficulty: item.difficulty,
      estimatedHours: Math.ceil((item.estimatedDuration || 0) / 60),
      thumbnail: item.thumbnail || 'https://cdn.pioneeracademy.academy/placeholders/course-default.jpg',
      instructors: [],
      learningObjectives: [],
      tags: item.tags || [],
      status: item.status,
      // CRUCIAL: Mettre l'item normalisé dans un tableau layers
      layers: [normalizedLayer],
      totalXp: item.xpReward || 0
    };
  }

  /**
   * GET /api/courses/:courseId/layers/:layerId
   */
  public getCourseLayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, layerId } = req.params;
      
      // Réutiliser la logique de recherche
      const rawCourses = Object.values(enrichedCourseExamples) as any[];
      const rawItem = rawCourses.find(item => {
        if (item && typeof item === 'object' && 'id' in item) return item.id === courseId;
        if (item && typeof item === 'object' && 'courseId' in item) return item.courseId === courseId;
        return false;
      });
      
      if (!rawItem) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }

      const course = this.normalizeToCourse(rawItem);
      
      // Recherche dans le tableau layers normalisé
      const layer = course.layers.find((l: any) => l.id === layerId || l.layerId === layerId);
      
      if (!layer) {
        res.status(404).json({ success: false, error: 'Layer not found' });
        return;
      }

      res.json({ success: true, data: layer });
    } catch (error: any) {
      console.error('[CourseController] Error fetching layer:', error);
      res.status(500).json({ success: false, error: 'Failed' });
    }
  };
}
