import { Course, Layer, UserProgress } from '../../types';
import { EnergySystem } from './EnergySystem';

export interface AccessResult {
    allowed: boolean;
    reason?: 'locked' | 'energy' | 'cooldown' | 'mastery' | 'premium';
    message?: string;
    remainingTime?: number;
}

export const AccessControl = {
    canAccessLayer(
        course: Course,
        layer: Layer,
        userProgress: UserProgress
    ): AccessResult {
        // 1. Determine if guest mode
        const isGuest = (userProgress as any)?.uid?.startsWith('guest_') || false;

        // 2. Check Global Course Lock (e.g. maintenance)
        if (course.locked) {
            return { allowed: false, reason: 'locked', message: 'This course is currently locked.' };
        }

        // 3. Check Energy (Skip for guests to allow discovery)
        if (!isGuest && !EnergySystem.hasEnoughEnergy(userProgress.energy, layer.energyCost)) {
            return { 
                allowed: false, 
                reason: 'energy', 
                message: `L'énergie est insuffisante. Besoin de ${layer.energyCost}⚡.` 
            };
        }

        // 4. Sequential Progression: Check Prerequisites (Previous Layer Mastery)
        const layers = course.layers;
        const currentLayerIndex = layers.findIndex(l => l.id === layer.id);
        
        if (currentLayerIndex > 0) {
            const prevLayer = layers[currentLayerIndex - 1];
            
            // Check in layerProgress array
            const progressList = userProgress.layerProgress || [];
            const prevProgress = progressList.find(lp => lp.layerId === prevLayer.id);
            const isMastered = prevProgress?.mastered || (prevProgress?.bestScore || 0) >= prevLayer.requiredMastery;
            
            // Fallback: check completedLayers map from root if legacy
            const completedLayersMap = (userProgress as any).completedLayers;
            const isLegacyMastered = completedLayersMap?.[course.id]?.includes(prevLayer.id);

            if (!isMastered && !isLegacyMastered) {
                return {
                    allowed: false,
                    reason: 'mastery',
                    message: `Terminez d'abord '${prevLayer.title}' pour débloquer ce contenu.`
                };
            }
        }

        return { allowed: true };
    }
};
