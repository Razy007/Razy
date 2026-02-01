import React from 'react';
import { Layer } from '../../types';
import { DiscoveryViewer } from './DiscoveryViewer';
import { QuizViewer } from './QuizViewer';
import { SmartLabViewer } from './SmartLabViewer';
import { ApiService } from '../../services/ApiService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface LayerViewerProps {
    layer: Layer;
    userProgress: any;
    onComplete: (data?: any) => void;
    onClose: () => void;
}

export const LayerViewer: React.FC<LayerViewerProps> = ({ 
    layer, 
    userProgress, 
    onComplete, 
    onClose 
}) => {
    const { updateProgressSync } = useAuth();

    const handleLabAction = async (action: any) => {
        try {
            // 1. Handle Energy Logic (Optimistic UI)
            if (action.energyCost > 0) {
                updateProgressSync(0, 0, action.energyCost);
                
                // Backend Sync (Silent Fail safe)
                // Only try to sync if we suspect a user is logged in (has basic auth data)
                const hasAuth = localStorage.getItem('pi_user');
                if (hasAuth) {
                    ApiService.consumeEnergy(action.energyCost).catch(e => {
                        console.warn("Background energy sync failed (non-critical)", e);
                        // Do NOT show error toast to user, optimistic UI is enough for gameplay flow
                    });
                }
            }

            // 2. Handle XP Logic (Optimistic UI)
            if (action.consequence?.xpChange) {
                console.log(`[Lab] Applying XP Change: ${action.consequence.xpChange}`);
                updateProgressSync(action.consequence.xpChange, 0, 0);
            }

        } catch (err) {
            console.error("Local Lab logic failed", err);
            // Only toast if LOCAL logic fails completely
        }
    };
    // Determine which viewer to show based on layer type
    switch (layer.type) {
        // DISCOVERY CONTENT
        case 'discovery':
            return (
                <DiscoveryViewer 
                    layer={layer as any} // Temporary cast for discovery content mismatch
                    onComplete={onComplete}
                    onClose={onClose}
                />
            );
            
        // QUIZ CONTENT
        case 'comprehension':
        case 'quiz':
            return (
                <QuizViewer 
                    layer={layer}
                    userProgress={userProgress}
                    onComplete={(score: number, answers: any[]) => onComplete({ score, answers })}
                    onClose={onClose}
                />
            );
            
        // LAB CONTENT (Simulations)
        case 'decision-lab':
            return (
                <SmartLabViewer 
                    layer={layer}
                    userProgress={userProgress}
                    onAction={handleLabAction} 
                    onComplete={onComplete}
                    onClose={onClose}
                />
            );
            
        default:
            return (
                <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Type de contenu inconnu: {(layer as any).type}</h2>
                    <button onClick={onClose} className="bg-slate-800 px-6 py-2 rounded-lg text-white">Fermer</button>
                </div>
            );
    }
};
