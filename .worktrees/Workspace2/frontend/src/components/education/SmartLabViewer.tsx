import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, Search, Play, XCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Layer, InteractiveAction, UserProgress, PiUserProgress } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/ApiService';

import { getRandomLabScenario } from '../../data/labScenarios';

interface SmartLabViewerProps {
    layer: Layer;
    userProgress: UserProgress | PiUserProgress;
    onAction: (action: InteractiveAction) => void;
    onComplete: () => void;
    onClose: () => void;
}

export const SmartLabViewer: React.FC<SmartLabViewerProps> = ({ 
    layer, 
    userProgress, 
    onAction, 
    onComplete,
    onClose 
}) => {
    const { t, i18n } = useTranslation();
    const { updateProgressSync, user } = useAuth();
    
    // ANTI-MONOTONY: Load random scenario on mount independently of static props
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Normalize language
        const lang = (i18n.language === 'fr') ? 'fr' : 'en';
        // Try to get a fresh random scenario
        const dynamicScenario = getRandomLabScenario(layer.id, lang);
        if (dynamicScenario) {
            setData(dynamicScenario);
        } else {
            // Fallback to static data if exists (or null)
            setData(layer.interactiveData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layer.id, i18n.language]);

    const [logs, setLogs] = useState<{msg: string, type: string}[]>([]);
    const [completedActions, setCompletedActions] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState<{msg: string, type: string, sub?: string} | null>(null);
    
    // SECURITY: Safe access values - corrected to match userProgress structure (energyBalance)
    // Fallback chain: energyBalance (new) -> energy.current (old) -> 0
    const currentEnergy = userProgress?.energyBalance ?? (userProgress as any)?.energy?.current ?? 0;

    useEffect(() => {
        if (showFeedback) {
            const timer = setTimeout(() => setShowFeedback(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [showFeedback]);

    // ANTI-MONOTONY: Shuffle actions on mount (based on new dynamic data)
    const shuffledActions = React.useMemo(() => {
        if (!data?.actions) return [];
        return [...data.actions].sort(() => Math.random() - 0.5);
    }, [data]);

    if (!data) return null;

    const handleActionClick = async (action: InteractiveAction) => {
        // 1. Check Energy (SECURED)
        if (currentEnergy < action.energyCost) {
            setShowFeedback({
                msg: t('alerts.insufficient_balance'),
                type: 'error',
                sub: t('energy.price') + `: ${action.energyCost - currentEnergy}⚡`
            });
            return;
        }

        // ⚡ CRITICAL FIX: Consume Energy IMMEDIATELY
        if (action.energyCost > 0) {
            updateProgressSync(0, 0, action.energyCost);
            
            // Sync with backend for logged-in users
            const isGuest = user?.uid?.startsWith('guest_') || !localStorage.getItem('pi_user')?.includes('"accessToken"');
            if (!isGuest) {
                 try {
                     await ApiService.consumeEnergy(action.energyCost);
                 } catch (e) {
                     console.warn("Backend energy sync warning", e);
                 }
            }
        }

        // 2. Trigger Action Logic
        onAction(action);
        setCompletedActions(prev => [...prev, action.id]);

        // 3. UX Feedback
        setLogs(prev => [{
            msg: action.feedback,
            type: action.feedbackType
        }, ...prev]);

        // Visual Feedback Overlay
        if (action.feedbackType === 'positive') {
            setShowFeedback({
                msg: t('common.success'),
                type: 'positive',
                sub: action.consequence?.xpChange ? `+${action.consequence.xpChange} XP` : undefined
            });
            
            // Auto-complete after short delay
            setTimeout(() => {
                onComplete();
            }, 2000);
        } else if (action.feedbackType === 'warning') {
            setShowFeedback({
                msg: "Méfiance...",
                type: 'warning',
                sub: "Indice obtenu"
            });
        } else if (action.feedbackType === 'negative') {
             setShowFeedback({
                msg: "Erreur Critique !",
                type: 'negative',
                sub: action.consequence?.xpChange ? `${action.consequence.xpChange} XP` : undefined
            });
        }
    };

    return (
        <div className="fixed inset-0 h-[100dvh] bg-slate-950 z-[9999] flex flex-col items-center justify-center overflow-hidden pb-safe-area-bottom">
            {/* Immersive Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
            </div>

            {/* Visual Feedback Overlay (Toast-like) */}
            {showFeedback && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] animate-bounceIn w-[90%] md:w-auto">
                    <div className={`px-8 py-5 rounded-[2rem] shadow-2xl border-2 flex items-center gap-5 backdrop-blur-2xl ${
                        showFeedback.type === 'positive' ? 'bg-green-600/20 border-green-500/50 text-green-100' :
                        showFeedback.type === 'negative' ? 'bg-red-600/20 border-red-500/50 text-red-100' :
                        showFeedback.type === 'warning' ? 'bg-orange-600/20 border-orange-500/50 text-orange-100' :
                        'bg-slate-800/80 border-slate-500/50 text-white'
                    }`}>
                         <div className="bg-white/10 p-3 rounded-2xl">
                            {showFeedback.type === 'positive' ? <CheckCircle size={28} /> :
                             showFeedback.type === 'negative' ? <XCircle size={28} /> :
                             <Search size={28} />}
                        </div>
                        <div>
                            <h3 className="font-black text-xl font-heading tracking-tight leading-none mb-1">{showFeedback.msg}</h3>
                            {showFeedback.sub && <p className="opacity-70 font-bold text-xs uppercase tracking-widest">{showFeedback.sub}</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="z-10 bg-slate-900/40 backdrop-blur-3xl md:rounded-[3rem] flex flex-col w-full md:max-w-7xl md:h-[85vh] h-full overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                
                {/* 1️⃣ HEADER: High-Tech Control Center */}
                <div className="bg-white/[0.02] p-5 md:p-8 border-b border-white/5 shrink-0">
                    <div className="flex justify-between items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3.5 rounded-2xl shadow-lg shadow-purple-500/20">
                                <Search className="text-white" size={24}/>
                            </div>
                            <div>
                                <h2 className="text-white font-black text-lg md:text-2xl font-heading tracking-tight uppercase">{data.title || layer.title}</h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Investigation Lab v2.0</span>
                                    <div className="h-1 w-8 bg-green-500/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                             <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                <Zap size={16} className="text-yellow-400" fill="currentColor"/>
                                <span className="text-white font-black text-sm">{currentEnergy}</span>
                                {/* DEBUG: Temporary display to diagnose mobile issue */}
                                <span className="text-[9px] text-slate-500 hidden md:inline ml-1">(B:{userProgress?.energyBalance ?? '?'}/C:{(userProgress as any)?.energy?.current ?? '?'})</span>
                             </div>
                             
                             <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5 flex items-center gap-2 group">
                                <span className="hidden md:inline font-black text-[10px] uppercase tracking-widest ml-1">Fermer</span>
                                <XCircle size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2️⃣ CONTENT AREA */}
                <div className="flex-grow flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
                    
                    {/* Left Panel: Narrative & Insights */}
                    <div className="flex-1 flex flex-col overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-none">
                        {/* Immersive Mission Briefing */}
                        <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/20 overflow-hidden group">
                             <div className="absolute -top-24 -right-24 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                 <Search size={300} className="text-blue-400" />
                             </div>
                             
                             <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                     <div className="h-[2px] w-8 bg-blue-500" />
                                     <h3 className="text-blue-400 font-black uppercase text-[11px] tracking-[0.3em]">Briefing Stratégique</h3>
                                </div>
                                <div className="prose prose-invert max-w-none">
                                    <ReactMarkdown>{data.initialState}</ReactMarkdown>
                                </div>
                             </div>
                        </div>

                        {/* Terminal Console */}
                        <div className="flex flex-col flex-grow min-h-[300px] bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 font-mono overflow-hidden">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.25em] text-slate-600 uppercase">System Intelligence Log</span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-4 pr-2 scrollbar-none">
                                {logs.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-700 italic text-center space-y-4">
                                        <div className="w-16 h-1 w-1 bg-slate-800 animate-pulse" />
                                        <p className="text-sm font-bold uppercase tracking-widest opacity-30">Scan Initial en Attente</p>
                                    </div>
                                ) : (
                                    logs.map((log, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-5 rounded-2xl border-l-4 ${
                                            log.type === 'positive' ? 'border-green-500 bg-green-500/5 text-green-300' :
                                            log.type === 'negative' ? 'border-red-500 bg-red-500/5 text-red-300' :
                                            log.type === 'warning' ? 'border-orange-500 bg-orange-500/5 text-orange-300' :
                                            'border-blue-500 bg-blue-500/5 text-blue-300'
                                        }`}>
                                            <div className="flex justify-between items-start mb-2 opacity-40">
                                                <span className="text-[9px] font-black uppercase tracking-widest">T+{(logs.length - i).toString().padStart(3, '0')} sec</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{log.type}</span>
                                            </div>
                                            <p className="text-sm md:text-base font-bold leading-relaxed">{log.msg}</p>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="h-8 md:hidden" />
                    </div>

                    {/* Right Panel: Interaction Deck */}
                    <div className="w-full md:w-[450px] bg-white/[0.01] backdrop-blur-2xl border-t md:border-t-0 md:border-l border-white/5 p-6 md:p-10 flex flex-col shrink-0 overflow-y-auto h-[40vh] md:h-auto">
                         <div className="mb-8 shrink-0">
                            <h3 className="text-white font-black text-2xl font-heading tracking-tight mb-2">Décisions</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{shuffledActions.length} Protocoles Détectés</p>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-5 pr-2 scrollbar-none">
                            {shuffledActions.map((action, idx) => {
                                const isCompleted = completedActions.includes(action.id);
                                return (
                                    <motion.button
                                        key={action.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleActionClick(action)}
                                        disabled={isCompleted}
                                        className={`w-full relative group overflow-hidden rounded-[2rem] border-2 transition-all duration-500 p-6 text-left ${
                                            isCompleted 
                                            ? 'bg-slate-800/10 border-white/5 opacity-30 grayscale'
                                            : 'bg-white/[0.03] border-white/5 hover:border-blue-500/50 hover:bg-white/[0.08] hover:shadow-2xl shadow-blue-500/5'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-5">
                                            <div className={`p-3 rounded-xl ${
                                                isCompleted ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg'
                                            }`}>
                                                 <Play size={18} fill="white" className="text-white ml-0.5"/>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className={`px-3 py-1 bg-black/40 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                                    currentEnergy >= action.energyCost ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                    <Zap size={10} fill="currentColor"/> {action.energyCost}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <h4 className="text-white font-black text-lg mb-2 font-heading tracking-tight leading-none group-hover:text-blue-400 transition-colors">{action.label}</h4>
                                        <p className="text-slate-500 text-xs font-bold leading-relaxed">Engager l&apos;analyse de ce point critique.</p>

                                        {/* Completed Indicator */}
                                        {isCompleted && (
                                            <div className="absolute top-0 right-0 p-4">
                                                <CheckCircle size={20} className="text-green-500 opacity-50" />
                                            </div>
                                        )}
                                        
                                        {!isCompleted && (
                                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <ArrowRight size={20} className="text-blue-400" />
                                            </div>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
