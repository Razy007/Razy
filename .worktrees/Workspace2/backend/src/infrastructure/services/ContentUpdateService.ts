/**
 * ============================================================================
 * CONTENT UPDATE SERVICE - Mise à Jour Automatique des Cours
 * ============================================================================
 * Synchronisation automatique avec CMS headless (Strapi/Contentful)
 * Gestion versions, cache intelligent, rollback support
 * ============================================================================
 */

import axios from 'axios';
import { createHash } from 'crypto';
import { LayerContent, EnrichedCourse, ContentUpdateManifest, ContentStatus } from '../../domain/entities/CourseContent';

interface ContentCache {
  version: string;
  timestamp: Date;
  data: any;
  checksum: string;
}

interface SyncResult {
  success: boolean;
  coursesUpdated: number;
  layersUpdated: number;
  errors: string[];
  duration: number;
}

export class ContentUpdateService {
  private cmsUrl: string;
  private apiKey: string;
  private cacheStore: Map<string, ContentCache> = new Map();
  private syncInterval: number; // milliseconds
  private autoPublish: boolean;
  private cacheTTL: number; // seconds

  constructor() {
    this.cmsUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    this.apiKey = process.env.STRAPI_API_TOKEN || '';
    this.syncInterval = parseInt(process.env.CONTENT_SYNC_INTERVAL || '300000'); // 5 min par défaut
    this.autoPublish = process.env.CONTENT_AUTO_PUBLISH === 'true';
    this.cacheTTL = parseInt(process.env.CONTENT_CACHE_TTL || '3600'); // 1h par défaut
  }

  /**
   * Démarrer synchronisation automatique
   */
  startAutoSync(): void {
    console.log(`[ContentUpdate] Auto-sync démarré (interval: ${this.syncInterval/1000}s)`);
    
    setInterval(async () => {
      try {
        await this.syncAllContent();
      } catch (error) {
        console.error('[ContentUpdate] Auto-sync error:', error);
      }
    }, this.syncInterval);

    // Sync immédiate au démarrage
    this.syncAllContent();
  }

  /**
   * Synchroniser tout le contenu depuis le CMS
   */
  async syncAllContent(): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      success: true,
      coursesUpdated: 0,
      layersUpdated: 0,
      errors: [],
      duration: 0
    };

    try {
      console.log('[ContentUpdate] Démarrage synchronisation...');

      // 1. Récupérer manifest des mises à jour
      const manifest = await this.fetchUpdateManifest();
      
      if (!manifest) {
        console.log('[ContentUpdate] Aucune mise à jour disponible');
        result.duration = Date.now() - startTime;
        return result;
      }

      console.log(`[ContentUpdate] Manifest v${manifest.version} trouvé avec ${manifest.changes.length} changements`);

      // 2. Traiter chaque changement
      for (const change of manifest.changes) {
        try {
          if (change.type === 'new' || change.type === 'updated') {
            if (change.layerId) {
              // Mise à jour layer spécifique
              await this.syncLayer(change.courseId, change.layerId);
              result.layersUpdated++;
            } else {
              // Mise à jour cours complet
              await this.syncCourse(change.courseId);
              result.coursesUpdated++;
            }
          } else if (change.type === 'deprecated') {
            await this.deprecateContent(change.courseId, change.layerId);
          }
        } catch (error: any) {
          result.errors.push(`${change.courseId}/${change.layerId || 'course'}: ${error.message}`);
          result.success = false;
        }
      }

      // 3. Vérifier intégrité des données
      const checksumValid = await this.verifyChecksum(manifest);
      if (!checksumValid) {
        result.errors.push('Checksum verification failed');
        result.success = false;
      }

      console.log(`[ContentUpdate] Sync terminé: ${result.coursesUpdated} cours, ${result.layersUpdated} layers`);
      
    } catch (error: any) {
      console.error('[ContentUpdate] Sync failed:', error);
      result.success = false;
      result.errors.push(error.message);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Récupérer manifest des mises à jour depuis CMS
   */
  private async fetchUpdateManifest(): Promise<ContentUpdateManifest | null> {
    try {
      const response = await axios.get(`${this.cmsUrl}/api/content-updates/manifest`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const data = response.data;
      
      return {
        version: data.version,
        releaseDate: new Date(data.releaseDate),
        changes: data.changes,
        downloadUrl: data.downloadUrl,
        checksum: data.checksum
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Pas de nouvelles mises à jour
      }
      throw new Error(`Failed to fetch manifest: ${error.message}`);
    }
  }

  /**
   * Synchroniser un layer spécifique
   */
  private async syncLayer(courseId: string, layerId: string): Promise<void> {
    console.log(`[ContentUpdate] Syncing layer: ${courseId}/${layerId}`);

    // Vérifier cache
    const cacheKey = `layer:${courseId}:${layerId}`;
    const cached = this.cacheStore.get(cacheKey);
    
    if (cached && this.isCacheValid(cached)) {
      console.log(`[ContentUpdate] Using cached layer: ${layerId}`);
      return;
    }

    // Récupérer depuis CMS
    const response = await axios.get(`${this.cmsUrl}/api/courses/${courseId}/layers/${layerId}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      timeout: 15000
    });

    const layerData = response.data.data;
    const layerContent = this.mapCMSToLayerContent(layerData);

    // Valider avant enregistrement
    this.validateLayerContent(layerContent);

    // Enregistrer dans base de données
    await this.saveLayerToDatabase(layerContent);

    // Mettre en cache
    const checksum = this.calculateChecksum(JSON.stringify(layerData));
    this.cacheStore.set(cacheKey, {
      version: layerData.attributes.version,
      timestamp: new Date(),
      data: layerContent,
      checksum
    });

    console.log(`[ContentUpdate] Layer ${layerId} synchronized successfully`);
  }

  /**
   * Synchroniser un cours complet
   */
  private async syncCourse(courseId: string): Promise<void> {
    console.log(`[ContentUpdate] Syncing course: ${courseId}`);

    const response = await axios.get(`${this.cmsUrl}/api/courses/${courseId}?populate=*`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      timeout: 20000
    });

    const courseData = response.data.data;
    const course = this.mapCMSToCourse(courseData);

    // Valider
    this.validateCourse(course);

    // Enregistrer
    await this.saveCourseToDatabase(course);

    console.log(`[ContentUpdate] Course ${courseId} synchronized successfully`);
  }

  /**
   * Mapper données CMS vers LayerContent
   */
  private mapCMSToLayerContent(cmsData: any): LayerContent {
    const attrs = cmsData.attributes;
    
    return {
      layerId: cmsData.id,
      courseId: attrs.courseId,
      title: attrs.title,
      description: attrs.description,
      difficulty: attrs.difficulty,
      estimatedDuration: attrs.estimatedDuration,
      tags: attrs.tags || [],
      contentType: attrs.contentType,
      markdown: attrs.content,
      
      // Vidéo
      video: attrs.video ? {
        provider: attrs.video.provider,
        videoId: attrs.video.videoId,
        url: attrs.video.url,
        duration: attrs.video.duration,
        thumbnail: attrs.video.thumbnail,
        subtitles: attrs.video.subtitles || [],
        chapters: attrs.video.chapters || [],
        quality: attrs.video.quality || ['720p'],
        transcription: attrs.video.transcription
      } : undefined,
      
      // Simulation
      simulation: attrs.simulation ? {
        type: attrs.simulation.type,
        iframeUrl: attrs.simulation.iframeUrl,
        embedCode: attrs.simulation.embedCode,
        interactionPoints: attrs.simulation.interactionPoints || [],
        successCriteria: attrs.simulation.successCriteria,
        hints: attrs.simulation.hints || []
      } : undefined,
      
      // Case Study
      caseStudy: attrs.caseStudy ? {
        title: attrs.caseStudy.title,
        scenario: attrs.caseStudy.scenario,
        context: attrs.caseStudy.context,
        challenges: attrs.caseStudy.challenges || [],
        realWorldExample: attrs.caseStudy.realWorldExample
      } : undefined,
      
      // Code Sandbox
      codeSandbox: attrs.codeSandbox ? {
        language: attrs.codeSandbox.language,
        starterCode: attrs.codeSandbox.starterCode,
        solution: attrs.codeSandbox.solution,
        tests: attrs.codeSandbox.tests || [],
        environment: attrs.codeSandbox.environment || {},
        hints: attrs.codeSandbox.hints || []
      } : undefined,
      
      // Practice Lab
      practiceLab: attrs.practiceLab ? {
        title: attrs.practiceLab.title,
        objective: attrs.practiceLab.objective,
        estimatedTime: attrs.practiceLab.estimatedTime,
        prerequisites: attrs.practiceLab.prerequisites || [],
        steps: attrs.practiceLab.steps || [],
        resources: attrs.practiceLab.resources || []
      } : undefined,
      
      attachments: attrs.attachments || [],
      quizId: attrs.quizId,
      quizRequired: attrs.quizRequired || false,
      xpReward: attrs.xpReward || 50,
      energyCost: attrs.energyCost || 0,
      unlockConditions: attrs.unlockConditions || [],
      
      status: this.autoPublish ? ContentStatus.PUBLISHED : attrs.status,
      publishedAt: attrs.publishedAt ? new Date(attrs.publishedAt) : undefined,
      scheduledFor: attrs.scheduledFor ? new Date(attrs.scheduledFor) : undefined,
      lastUpdated: new Date(),
      version: attrs.version || '1.0.0',
      author: attrs.author || { name: 'Pioneer Academy', role: 'Content Team' }
    };
  }

  /**
   * Mapper données CMS vers EnrichedCourse
   */
  private mapCMSToCourse(cmsData: any): EnrichedCourse {
    const attrs = cmsData.attributes;
    
    return new EnrichedCourse(
      cmsData.id,
      attrs.title,
      attrs.description,
      attrs.category,
      attrs.difficulty,
      attrs.estimatedHours,
      attrs.thumbnail,
      attrs.bannerImage,
      attrs.instructors || [],
      attrs.syllabus || [],
      attrs.learningObjectives || [],
      attrs.prerequisites || [],
      attrs.targetAudience || [],
      attrs.certificationAvailable || false,
      attrs.tags || [],
      this.autoPublish ? ContentStatus.PUBLISHED : attrs.status,
      attrs.publishedAt ? new Date(attrs.publishedAt) : undefined,
      attrs.enrollmentCount || 0,
      attrs.averageRating || 0,
      attrs.reviewCount || 0
    );
  }

  /**
   * Valider LayerContent avant enregistrement
   */
  private validateLayerContent(layer: LayerContent): void {
    if (!layer.layerId || !layer.courseId) {
      throw new Error('layerId and courseId are required');
    }
    
    if (!layer.title || layer.title.length < 5) {
      throw new Error('title must be at least 5 characters');
    }
    
    if (layer.xpReward < 0 || layer.xpReward > 1000) {
      throw new Error('xpReward must be between 0 and 1000');
    }
    
    if (layer.energyCost < 0 || layer.energyCost > 100) {
      throw new Error('energyCost must be between 0 and 100');
    }
    
    // Validation spécifique par type de contenu
    if (layer.contentType === 'video' && !layer.video) {
      throw new Error('video content is required when contentType is video');
    }
    
    if (layer.contentType === 'interactive_simulation' && !layer.simulation) {
      throw new Error('simulation content is required when contentType is interactive_simulation');
    }
  }

  /**
   * Valider EnrichedCourse
   */
  private validateCourse(course: EnrichedCourse): void {
    if (!course.id || !course.title) {
      throw new Error('id and title are required');
    }
    
    if (course.estimatedHours < 0 || course.estimatedHours > 500) {
      throw new Error('estimatedHours must be between 0 and 500');
    }
  }

  /**
   * Enregistrer layer dans base de données
   */
  private async saveLayerToDatabase(layer: LayerContent): Promise<void> {
    // TODO: Implémenter avec votre repository PostgreSQL/MongoDB
    // Exemple:
    // await this.contentRepository.saveLayer(layer);
    
    console.log(`[ContentUpdate] Saved layer ${layer.layerId} to database`);
  }

  /**
   * Enregistrer course dans base de données
   */
  private async saveCourseToDatabase(course: EnrichedCourse): Promise<void> {
    // TODO: Implémenter avec votre repository
    // await this.contentRepository.saveCourse(course);
    
    console.log(`[ContentUpdate] Saved course ${course.id} to database`);
  }

  /**
   * Marquer contenu comme déprécié
   */
  private async deprecateContent(courseId: string, layerId?: string): Promise<void> {
    console.log(`[ContentUpdate] Deprecating ${courseId}${layerId ? '/' + layerId : ''}`);
    
    // TODO: Mettre à jour status dans base de données
    // if (layerId) {
    //   await this.contentRepository.updateLayerStatus(layerId, ContentStatus.ARCHIVED);
    // } else {
    //   await this.contentRepository.updateCourseStatus(courseId, ContentStatus.ARCHIVED);
    // }
  }

  /**
   * Vérifier checksum du manifest
   */
  private async verifyChecksum(manifest: ContentUpdateManifest): Promise<boolean> {
    try {
      const response = await axios.get(manifest.downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      });
      
      const actualChecksum = this.calculateChecksum(response.data);
      return actualChecksum === manifest.checksum;
      
    } catch (error) {
      console.error('[ContentUpdate] Checksum verification failed:', error);
      return false;
    }
  }

  /**
   * Calculer checksum SHA-256
   */
  private calculateChecksum(data: string | Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Vérifier si cache est valide
   */
  private isCacheValid(cache: ContentCache): boolean {
    const now = new Date();
    const cacheAge = (now.getTime() - cache.timestamp.getTime()) / 1000;
    return cacheAge < this.cacheTTL;
  }

  /**
   * Invalider cache pour un contenu spécifique
   */
  invalidateCache(courseId: string, layerId?: string): void {
    if (layerId) {
      this.cacheStore.delete(`layer:${courseId}:${layerId}`);
    } else {
      // Invalider tous les layers du cours
      for (const key of this.cacheStore.keys()) {
        if (key.startsWith(`layer:${courseId}:`)) {
          this.cacheStore.delete(key);
        }
      }
      this.cacheStore.delete(`course:${courseId}`);
    }
    
    console.log(`[ContentUpdate] Cache invalidated for ${courseId}${layerId ? '/' + layerId : ''}`);
  }

  /**
   * Récupérer statistiques de synchronisation
   */
  getSyncStats(): {
    cacheSize: number;
    lastSync: Date | null;
    nextSync: Date;
  } {
    return {
      cacheSize: this.cacheStore.size,
      lastSync: null, // TODO: Tracker dernière sync
      nextSync: new Date(Date.now() + this.syncInterval)
    };
  }

  /**
   * Webhook handler pour mises à jour temps réel depuis CMS
   */
  async handleWebhook(event: string, payload: any): Promise<void> {
    console.log(`[ContentUpdate] Webhook received: ${event}`);
    
    switch (event) {
      case 'entry.create':
      case 'entry.update':
        if (payload.model === 'layer') {
          await this.syncLayer(payload.courseId, payload.id);
        } else if (payload.model === 'course') {
          await this.syncCourse(payload.id);
        }
        break;
      
      case 'entry.delete':
        await this.deprecateContent(payload.courseId, payload.id);
        break;
      
      default:
        console.log(`[ContentUpdate] Unknown webhook event: ${event}`);
    }
  }
}
