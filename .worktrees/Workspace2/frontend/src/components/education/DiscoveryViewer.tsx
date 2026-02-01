import React, { useState, useMemo } from 'react';
import { CheckCircle, ChevronRight, ArrowLeft, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export interface LocalizedContent {
    fr: string;
    en: string;
}

export interface LocalizedArray {
    fr: string[];
    en: string[];
}

// The raw data format (allowing localization)
export interface RawDiscoveryContent {
    type: 'video' | 'case-study' | 'infographic' | 'demo' | 'article';
    title: string | LocalizedContent;
    description: string | LocalizedContent;
    content: string | LocalizedContent;
    duration?: string;
    visualUrl?: string;
    highlights?: string[] | LocalizedArray;
    codeExample?: string;
}

// The view model (resolved strings)
export interface DiscoveryContent {
    type: 'video' | 'case-study' | 'infographic' | 'demo' | 'article';
    title: string;
    description: string;
    content: string;
    duration?: string;
    visualUrl?: string;
    highlights?: string[];
    codeExample?: string;
}

interface DiscoveryViewerProps {
    content?: DiscoveryContent; // 🌍 Localized content passed from parent
    layer: {
        id: string;
        title: string;
        description: string;
        xpReward: number;
        energyCost: number;
        content?: string | LocalizedContent;
        discoveryContent?: DiscoveryContent;
    };
    onComplete: () => void;
    onClose: () => void;
}

export const DiscoveryViewer: React.FC<DiscoveryViewerProps> = ({ content: contentProp, layer, onComplete, onClose }) => {
    const { t, i18n } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    
    // 🛡️ ANTI-SPEEDRUN: Minimum 15 seconds per step
    const MIN_READ_TIME_SECONDS = 15;
    const [canProceed, setCanProceed] = useState(false);
    const [countdown, setCountdown] = useState(MIN_READ_TIME_SECONDS);

    // Reset timer when step changes
    React.useEffect(() => {
        setCanProceed(false);
        setCountdown(MIN_READ_TIME_SECONDS);
        
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanProceed(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStep]);

    // Prioritize passed contentProp (localized), then layer.discoveryContent, then fallback
    const content: DiscoveryContent = useMemo(() => {
        // Resolve raw content if present
        let resolvedContentText = '';
        if (layer.content) {
            if (typeof layer.content === 'string') {
                resolvedContentText = layer.content;
            } else {
                resolvedContentText = layer.content[i18n.language as 'fr' | 'en'] || layer.content['en'] || '';
            }
        }

        return contentProp || layer.discoveryContent || {
            type: 'article',
            title: layer.title,
            description: layer.description,
            content: resolvedContentText || `Explorez ce sujet fascinant à travers une approche visuelle et pratique.\n\n${layer.description}`,
            highlights: [] // Default to single page if not specified
        };
    }, [contentProp, layer.discoveryContent, layer.title, layer.description, layer.content, i18n.language]);

    const contentSteps = useMemo(() => {
        // If we have explicit highlights, use them as step titles for a guided tour
        if (content.highlights && content.highlights.length > 0) {
            return content.highlights;
        }
        // Otherwise, NO PAGINATION. Just one content block.
        return [content.title];
    }, [content.highlights, content.title]);

    // Split content into logical paragraphs for each step
    const contentParagraphs = useMemo(() => {
        // If we have explicit highlights, map content to them
        if (content.highlights && content.highlights.length > 0) {
             const paragraphs = content.content.split('\n\n').filter(p => p.trim());
             if (paragraphs.length >= content.highlights.length) {
                const itemsPerStep = Math.ceil(paragraphs.length / content.highlights.length);
                return content.highlights.map((_, index) => {
                    const start = index * itemsPerStep;
                    const end = Math.min(start + itemsPerStep, paragraphs.length);
                    return paragraphs.slice(start, end).join('\n\n');
                });
             }
        }
        
        // Default: Return the WHOLE content as one block
        return [content.content];
    }, [content.content, content.highlights]);

    const getTypeLabel = () => {
        switch (content.type) {
            case 'video': return t('course.discovery_video') || '🎬 Vidéo Interactive';
            case 'case-study': return t('course.discovery_case_study') || '📚 Étude de Cas';
            case 'infographic': return t('course.discovery_infographic') || '💡 Infographie';
            case 'demo': return t('course.discovery_demo') || '⚡ Démonstration';
            default: return t('course.discovery_article') || '📖 Article';
        }
    };

    const handleNext = () => {
        if (!canProceed) return; // 🛡️ Block if timer not finished
        
        if (currentStep < contentSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        setIsCompleted(true);
        setTimeout(() => {
            onComplete();
        }, 1500);
    };

    // ✅ UNIFIED PREMIUM UI: Removed the 'double UI' and simplified into one immersive experience
    return (
        <div className="fixed inset-0 h-[100dvh] bg-[#060a15] z-[9999] flex flex-col animate-fadeIn overflow-hidden text-white pb-safe-area-bottom">
            {/* 1️⃣ PREMIUM HEADER */}
            <div className="p-4 md:p-10 flex justify-between items-center shrink-0 z-20">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <button onClick={onClose} className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5 shrink-0">
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <div className="min-w-0">
                        <span className="text-yellow-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] block mb-0.5">
                            {getTypeLabel()} • {currentStep + 1} / {contentSteps.length}
                        </span>
                        <h2 className="text-sm md:text-base font-bold text-white/60 truncate max-w-[120px] md:max-w-md uppercase tracking-tight">{layer.title}</h2>
                    </div>
                </div>
                <div className="bg-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-white/5 flex items-center gap-2 shrink-0">
                    <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-500" />
                    <span className="text-[10px] md:text-xs font-black">+{layer.xpReward} XP</span>
                </div>
            </div>

            {/* 2️⃣ DYNAMIC PROGRESS BAR */}
            <div className="px-4 md:px-10 shrink-0">
                <div className="h-1 md:h-1.5 bg-white/5 w-full rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / contentSteps.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                    />
                </div>
            </div>

            {/* 3️⃣ MAIN CONTENT AREA (Immersive) */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-12 scrollbar-hide">
                <div className="max-w-3xl mx-auto space-y-8 md:space-y-12 pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="space-y-6 md:space-y-10"
                        >
                            {/* Visual Asset (Video/Image) */}
                            {content.type === 'video' && content.visualUrl && (
                                <div className="aspect-video rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl bg-black">
                                     <iframe
                                        width="100%"
                                        height="100%"
                                        src={content.visualUrl}
                                        title={content.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {/* Content Bubble */}
                            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl">
                                <h3 className="text-xl md:text-3xl lg:text-4xl font-black font-heading leading-tight mb-6 md:mb-8 text-white break-words">
                                    {contentSteps[currentStep]}
                                </h3>
                                
                                <div className="prose prose-invert prose-sm md:prose-lg max-w-none text-slate-300 space-y-4 md:space-y-6 leading-relaxed md:leading-loose overflow-wrap-anywhere">
                                    <ReactMarkdown>{contentParagraphs[currentStep]}</ReactMarkdown>
                                </div>

                                {content.codeExample && currentStep === contentSteps.length - 1 && (
                                    <div className="mt-8 md:mt-12 bg-black/40 rounded-xl md:rounded-2xl overflow-hidden border border-white/10">
                                        <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">EXEMPLE DE CODE</div>
                                        <pre className="p-4 md:p-6 text-xs md:text-sm font-mono text-yellow-500/80 overflow-x-auto scrollbar-hide">
                                            <code>{content.codeExample}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* 4️⃣ PREMIUM FOOTER NAVIGATION - FIXED ON MOBILE */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe-area-bottom md:p-10 border-t border-white/5 bg-gradient-to-t from-[#060a15] via-[#060a15]/95 to-transparent backdrop-blur-md flex items-center justify-between shrink-0 z-50">
                <button
                    onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                    className={`flex items-center gap-2 md:gap-3 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all ${
                        currentStep > 0 ? 'text-white hover:text-yellow-500' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    {t('common.previous')}
                </button>
                
                <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`px-8 md:px-14 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-2 md:gap-3 ${
                        canProceed 
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-black hover:scale-105 active:scale-95 shadow-yellow-500/10' 
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {!canProceed ? (
                        <>
                            <span className="tabular-nums">⏱️ {countdown}s</span>
                        </>
                    ) : currentStep < contentSteps.length - 1 ? (
                        <>
                            <span>{t('common.next')}</span>
                            <ChevronRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                            <span>{t('common.finish')}</span>
                        </>
                    )}
                </button>
            </div>

            {/* Completion Overlay */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 text-center"
                    >
                        <motion.div 
                            initial={{ scale: 0.5, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-gradient-to-br from-yellow-500 to-orange-500 p-8 rounded-[4rem] mb-8 shadow-3xl shadow-yellow-500/20"
                        >
                            <CheckCircle size={80} className="text-black" />
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">{t('course.completed')} !</h2>
                        <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 text-2xl font-black text-yellow-500">
                             +{layer.xpReward} XP Débloqués
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
