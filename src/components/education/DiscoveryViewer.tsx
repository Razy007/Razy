import React, { useState, useMemo } from 'react';
import { X, Play, FileText, Lightbulb, Code, CheckCircle, ChevronRight, BookOpen, Youtube } from 'lucide-react';

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
    layer: {
        id: string;
        title: string;
        description: string;
        xpReward: number;
        energyCost: number;
        discoveryContent?: DiscoveryContent;
    };
    onComplete: () => void;
    onClose: () => void;
}

export const DiscoveryViewer: React.FC<DiscoveryViewerProps> = ({ layer, onComplete, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Default content structure if not provided
    const content: DiscoveryContent = layer.discoveryContent || {
        type: 'article',
        title: layer.title,
        description: layer.description,
        content: `Explorez ce sujet fascinant à travers une approche visuelle et pratique.\n\n${layer.description}`,
        highlights: [
            'Concepts clés expliqués simplement',
            'Exemples concrets et pratiques',
            'Applications dans le monde réel'
        ]
    };

    const contentSteps = content.highlights || [content.description];

    // Split content into logical paragraphs for each step
    const contentParagraphs = useMemo(() => {
        const paragraphs = content.content.split('\n\n').filter(p => p.trim());
        
        // If we have highlights, try to distribute content evenly
        if (contentSteps.length > 1 && paragraphs.length >= contentSteps.length) {
            const itemsPerStep = Math.ceil(paragraphs.length / contentSteps.length);
            return contentSteps.map((_, index) => {
                const start = index * itemsPerStep;
                const end = Math.min(start + itemsPerStep, paragraphs.length);
                return paragraphs.slice(start, end).join('\n\n');
            });
        }
        
        // Fallback: show cumulative content (each step adds more)
        return contentSteps.map((_, index) => {
            const portionSize = Math.ceil(paragraphs.length / contentSteps.length);
            const end = Math.min((index + 1) * portionSize, paragraphs.length);
            return paragraphs.slice(0, end).join('\n\n');
        });
    }, [content.content, contentSteps.length]);

    const getTypeIcon = () => {
        switch (content.type) {
            case 'video': return <Play className="text-red-400" size={32} />;
            case 'case-study': return <FileText className="text-blue-400" size={32} />;
            case 'infographic': return <Lightbulb className="text-yellow-400" size={32} />;
            case 'demo': return <Code className="text-green-400" size={32} />;
            default: return <BookOpen className="text-purple-400" size={32} />;
        }
    };

    const getTypeLabel = () => {
        switch (content.type) {
            case 'video': return '🎬 Vidéo Interactive';
            case 'case-study': return '📚 Étude de Cas';
            case 'infographic': return '💡 Infographie';
            case 'demo': return '⚡ Démonstration';
            default: return '📖 Article';
        }
    };

    const handleStart = () => {
        setHasStarted(true);
    };

    const handleNext = () => {
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

    if (!hasStarted) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            {getTypeIcon()}
                            <div>
                                <span className="text-purple-300 text-sm font-semibold">{getTypeLabel()}</span>
                                <h2 className="text-white text-2xl font-bold">{content.title}</h2>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white/70 hover:text-white transition">
                            <X size={28} />
                        </button>
                    </div>

                    <div className="bg-black/30 rounded-xl p-6 mb-6">
                        <p className="text-white/90 text-lg leading-relaxed mb-4">{content.description}</p>
                        
                        {content.duration && (
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Play size={16} />
                                <span className="text-sm">Durée estimée: {content.duration}</span>
                            </div>
                        )}
                    </div>

                    {content.highlights && content.highlights.length > 0 && (
                        <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
                            <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
                                <Lightbulb size={18} />
                                Ce que vous allez découvrir
                            </h3>
                            <ul className="space-y-2">
                                {content.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-white/80 flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex items-center justify-between bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 mb-6 border border-green-400/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-400 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                                0
                            </div>
                            <div>
                                <p className="text-green-300 text-sm">Gratuit - Aucune énergie requise</p>
                                <p className="text-white font-semibold">+{layer.xpReward} XP à la fin</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 rounded-xl text-lg hover:scale-105 transition shadow-xl flex items-center justify-center gap-2"
                    >
                        <Play size={24} />
                        Commencer la découverte
                    </button>
                </div>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
                    <div className="mb-6">
                        <CheckCircle size={80} className="text-white mx-auto mb-4" />
                        <h2 className="text-white text-3xl font-bold mb-2">Découverte complétée !</h2>
                        <p className="text-white/90">Vous avez acquis de nouvelles connaissances</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 mb-6">
                        <p className="text-yellow-300 text-2xl font-bold">+{layer.xpReward} XP</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-purple-300 text-sm">
                            Étape {currentStep + 1} / {contentSteps.length}
                        </span>
                        <h2 className="text-white text-2xl font-bold">{content.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition">
                        <X size={28} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-black/30 rounded-full h-2 mb-6 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / contentSteps.length) * 100}%` }}
                    />
                </div>

                {/* Content Display */}
                <div className="bg-black/30 rounded-xl p-6 mb-6 min-h-[300px] animate-fadeIn">
                    {content.type === 'video' && (
                        <div className="mb-4">
                            {content.visualUrl ? (
                                // Real YouTube video embed
                                <div className="bg-black rounded-lg aspect-video overflow-hidden border-2 border-purple-500/50 shadow-xl">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={content.visualUrl}
                                        title={content.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            ) : (
                                // Animated placeholder when no video URL
                                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg aspect-video flex items-center justify-center border-2 border-purple-500/50 relative overflow-hidden">
                                    {/* Animated background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
                                    
                                    <div className="text-center relative z-10">
                                        <div className="relative inline-block mb-4">
                                            <Youtube size={64} className="text-red-500 animate-pulse" />
                                            <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl animate-ping"></div>
                                        </div>
                                        <p className="text-white/90 font-semibold mb-2">Contenu vidéo à venir</p>
                                        <p className="text-white/60 text-sm">📚 Lisez le contenu ci-dessous pour progresser</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                            <ChevronRight className="text-yellow-400" />
                            {contentSteps[currentStep]}
                        </h3>
                        <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                            {contentParagraphs[currentStep]}
                        </div>
                    </div>

                    {content.codeExample && currentStep === contentSteps.length - 1 && (
                        <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-green-500/30">
                            <div className="flex items-center gap-2 mb-3">
                                <Code size={16} className="text-green-400" />
                                <span className="text-green-400 text-sm font-semibold">Exemple de code</span>
                            </div>
                            <pre className="text-green-300 text-sm overflow-x-auto">
                                <code>{content.codeExample}</code>
                            </pre>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                    {currentStep > 0 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition"
                        >
                            ← Précédent
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-xl hover:scale-105 transition shadow-xl"
                    >
                        {currentStep < contentSteps.length - 1 ? 'Suivant →' : '✓ Terminer'}
                    </button>
                </div>
            </div>
        </div>
    );
};
