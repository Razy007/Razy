import React, { useState, useEffect } from 'react';
import { Course, Layer, UserProgress } from '../../types';
import { AccessControl } from '../../services/edu/AccessControl';
import { CooldownManager } from '../../services/CooldownManager';
import { Lock, Play, CheckCircle, Clock } from 'lucide-react';

interface LayerSelectorProps {
    course: Course;
    userProgress: UserProgress;
    onSelectLayer: (layer: Layer) => void;
    onClose: () => void;
}

export const LayerSelector: React.FC<LayerSelectorProps> = ({ course, userProgress, onSelectLayer, onClose }) => {
    const [, setTick] = useState(0);

    // Update every second for live countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-6 border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{course.title}</h2>
                        <p className="text-slate-400 text-sm">{course.category}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {course.layers.map((layer) => {
                        const { allowed, reason, message } = AccessControl.canAccessLayer(course, layer, userProgress);
                        const isCompleted = userProgress.completedLayers?.[course.id]?.includes(layer.id);
                        const mastery = userProgress.layerMastery?.[layer.id] || 0;
                        
                        // ⏱️ Check cooldown status
                        const cooldowns = userProgress.layerCooldowns || {};
                        const isOnCooldown = CooldownManager.isOnCooldown(layer.id, cooldowns);
                        const remainingSeconds = CooldownManager.getRemainingSeconds(layer.id, cooldowns);
                        const timeFormatted = CooldownManager.getRemainingTimeFormatted(layer.id, cooldowns);
                        const cooldownMessage = CooldownManager.getCooldownMessage(remainingSeconds);
                        
                        // Final allowed status includes cooldown check
                        const finalAllowed = allowed && !isOnCooldown;

                        return (
                            <button
                                key={layer.id}
                                onClick={() => finalAllowed && onSelectLayer(layer)}
                                disabled={!finalAllowed}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    finalAllowed 
                                        ? 'bg-slate-700 border-slate-600 hover:border-yellow-400 hover:bg-slate-650' 
                                        : 'bg-slate-800/50 border-slate-800 opacity-70 cursor-not-allowed'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                                layer.type === 'discovery' ? 'bg-blue-500/20 text-blue-400' :
                                                layer.type === 'comprehension' ? 'bg-green-500/20 text-green-400' :
                                                'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {layer.type}
                                            </span>
                                            {isCompleted && <CheckCircle size={14} className="text-green-400" />}
                                            
                                            {/* Compteur d'essais */}
                                            {!isOnCooldown && CooldownManager.getAttemptsMessage(layer.id, cooldowns) && (
                                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                                    {CooldownManager.getAttemptsMessage(layer.id, cooldowns)}
                                                </span>
                                            )}
                                            
                                            {/* Cooldown timer */}
                                            {isOnCooldown && (
                                                <span className="flex items-center gap-1 bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded">
                                                    <Clock size={12} className="animate-pulse" />
                                                    {timeFormatted}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-white mb-1">{layer.title}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-2">{layer.description}</p>
                                        
                                        {!allowed && !isOnCooldown && (
                                            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                                                {reason === 'locked' && <Lock size={12} />}
                                                {reason === 'energy' && <span className="text-yellow-500">⚡ Low Energy</span>}
                                                {reason === 'mastery' && <span className="text-orange-400">Target Mastery: {layer.requiredMastery}%</span>}
                                                <span>{message}</span>
                                            </div>
                                        )}
                                        
                                        {isOnCooldown && (
                                            <div className="flex items-center gap-2 mt-2 text-orange-400 text-xs">
                                                <Clock size={12} />
                                                <span>{cooldownMessage}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2 text-xs text-slate-400">
                                        <div className="flex items-center gap-1" title="Energy Cost">
                                            <span className="text-yellow-500">⚡</span> {layer.energyCost}
                                        </div>
                                        <div className="flex items-center gap-1" title="XP Reward">
                                            <span className="text-purple-400">★</span> {layer.xpReward}
                                        </div>
                                        {mastery > 0 && (
                                            <div className="mt-1 px-2 py-0.5 bg-slate-900 rounded text-slate-300">
                                                {mastery}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
