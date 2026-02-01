import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/BaseComponents';
import { 
  BarChart3, 
  ShieldCheck, 
  BrainCircuit, 
  Globe, 
  Lock, 
  TrendingUp, 
  Award,
  Info
} from 'lucide-react';

const SkillsAnalysisPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Process user progress
    const progress = useMemo(() => {
        // Handle both possible structures (direct user object or user.userProgress)
        // Handle both possible structures. Safely defaulting if user.userProgress is missing.
        const p = user?.userProgress || { level: 1, xp: 0, completedLayers: {} };
        return {
            level: p.level || 1,
            xp: p.xp || 0,
            completedLayers: p.completedLayers || {}
        };
    }, [user]);

    // Skill Categories Logic - Defining the matrix
    const skillCategories = useMemo(() => [
        {
            id: 'security',
            name: t('skills.security', 'Sécurité Pi'),
            icon: <ShieldCheck className="text-green-400" size={32} />,
            color: 'green',
            description: t('skills.security_desc', 'Maîtrise de la passphrase, détection de scams et protection du wallet.'),
            requiredLayers: ['wallet-l1-discovery', 'wallet-l2-comprehension', 'wallet-l3-lab', 'safety-l1', 'safety-l2', 'safety-l3-lab'],
            domain: 'Cybersecurity'
        },
        {
            id: 'fundamentals',
            name: t('skills.fundamentals', 'Économie Pi'),
            icon: <Globe className="text-blue-400" size={32} />,
            color: 'blue',
            description: t('skills.fundamentals_desc', 'Compréhension de la vision de Pi, du minage mobile et de l\'utilité réseau.'),
            requiredLayers: ['pi-intro-l1', 'pi-intro-l2', 'kyc-l1', 'kyc-l2'],
            domain: 'Basics'
        },
        {
            id: 'blockchain',
            name: t('skills.blockchain', 'Web3 & Node'),
            icon: <BrainCircuit className="text-purple-400" size={32} />,
            color: 'purple',
            description: t('skills.blockchain_desc', 'Fonctionnement du Stellar Consensus (SCP), décentralisation et smart contracts.'),
            requiredLayers: ['blockchain-l1', 'blockchain-l2'],
            domain: 'Advanced'
        },
        {
            id: 'defi',
            name: t('skills.defi', 'Finance & Staking'),
            icon: <TrendingUp className="text-yellow-400" size={32} />,
            color: 'yellow',
            description: t('skills.defi_desc', 'Utilisation des pools de liquidité, calcul de Yield et stratégies de Staking.'),
            requiredLayers: ['defi-l1', 'defi-l2'],
            domain: 'Expert'
        }
    ], [t]);

    const calculatedSkills = useMemo(() => {
        const completed = progress.completedLayers;
        
        return skillCategories.map(cat => {
            const layers = cat.requiredLayers;
            // Check if layer is completed. Backend returns layer IDs in array for each course, 
            // but we might have a flattened map or arrays. Handling both.
            let completedCount = 0;
            
            layers.forEach(lId => {
                // If completed is a flat array or object
                if (Array.isArray(completed)) {
                    if (completed.includes(lId)) completedCount++;
                } else if (typeof completed === 'object') {
                    // Check all keys (courses) to find the layer
                    Object.values(completed).forEach((courseLayers: unknown) => {
                        if (Array.isArray(courseLayers) && courseLayers.includes(lId)) {
                            completedCount++;
                        }
                    });
                }
            });

            const score = Math.round((completedCount / layers.length) * 100);
            
            let levelLabel = t('skills.beginner', 'Débutant');
            if (score >= 90) levelLabel = t('skills.expert', 'Expert');
            else if (score >= 60) levelLabel = t('skills.advanced', 'Avancé');
            else if (score >= 30) levelLabel = t('skills.intermediate', 'Intermédiaire');

            return {
                ...cat,
                score,
                levelLabel,
                isLocked: score === 0 && cat.id !== 'fundamentals' && progress.level < 2,
                completedCount,
                totalCount: layers.length
            };
        });
    }, [skillCategories, progress, t]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <BarChart3 size={14} />
                        {t('skills.diagnostic_title', 'Diagnostic de Compétences')}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
                        {t('skills.title_main', 'Analyse des')} <br /><span className="text-yellow-500">{t('skills.title_highlight', 'Capacités')}</span>
                    </h2>
                    <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
                        {t('skills.subtitle_desc', 'Chaque module complété et chaque quiz réussi affine votre profil de Pioneer. Ce diagnostic est la clé pour débloquer les opportunités avancées.')}
                    </p>
                </div>

                <Card className="w-full lg:w-80 group overflow-hidden border-white/5 bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] relative">
                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                         <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center text-black text-3xl font-black shadow-2xl shadow-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                            {progress.level}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{t('common.level', 'Niveau Actuel')}</p>
                            <p className="text-white text-xl font-black tracking-tight uppercase">{t('skills.rank_emeritus', 'Pionnier Émérite')}</p>
                         </div>
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-yellow-500" style={{ width: `${(progress.xp % 100)}%` }}></div>
                         </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-[60px] -mr-16 -mt-16" />
                </Card>
            </div>

            {/* Main Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {calculatedSkills.map((skill) => (
                    <Card 
                        key={skill.id}
                        className={`p-10 transition-all duration-700 hover:scale-[1.02] rounded-[3rem] border-white/5 relative overflow-hidden group ${
                            skill.isLocked ? 'grayscale opacity-50' : 'bg-white/5 backdrop-blur-3xl'
                        }`}
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className={`p-6 bg-white/5 rounded-3xl border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-700`}>
                                    {skill.icon}
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-3 justify-end mb-2">
                                        <Award size={18} className="text-yellow-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{skill.levelLabel}</span>
                                    </div>
                                    <p className="text-5xl font-black text-white tracking-tighter">{skill.score}%</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h3 className="text-2xl font-black text-white tracking-tight">{skill.name}</h3>
                                <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-2">
                                    {skill.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                    <span>{skill.completedCount} / {skill.totalCount} {t('common.modules', 'Modules')}</span>
                                    <span>{skill.score < 100 ? t('common.in_progress', 'En progression') : t('common.mastered', 'Expertise Validée')}</span>
                                </div>
                                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10 p-1">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                                            skill.color === 'green' ? 'from-green-500 to-emerald-400' :
                                            skill.color === 'blue' ? 'from-blue-500 to-indigo-400' :
                                            skill.color === 'purple' ? 'from-purple-500 to-pink-400' :
                                            'from-yellow-500 to-orange-400'
                                        }`}
                                        style={{ width: `${skill.score}%` }} 
                                    />
                                </div>
                            </div>

                            {skill.isLocked && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                                    <Lock size={48} className="text-white/20 mb-4" />
                                    <h4 className="text-xl font-black text-white mb-2">{t('skills.locked_title', 'Compétence Verrouillée')}</h4>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                        {t('skills.locked_desc', 'Atteignez le niveau 2 et validez les fondamentaux pour débloquer cette analyse.')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Background glowing shape */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </Card>
                ))}
            </div>

            {/* Strategic Insight Card */}
            <Card className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black p-12 lg:p-16 border-white/5 rounded-[4rem] relative overflow-hidden shadow-3xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-yellow-500 border border-white/10 shadow-inner">
                            <Info size={32} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter leading-[0.9]">
                            {t('skills.logic_prefix', 'Logique de')} <br /><span className="text-yellow-500">{t('skills.validation_title', 'Validation Pi')}</span>
                        </h3>
                        <div className="space-y-6">
                            <p className="text-white/40 text-lg font-medium leading-relaxed">
                                {t('skills.logic_desc', 'Votre score de compétence (SkillScore) est calculé sur une base pondérée :')}
                            </p>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4 group">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                                    <span className="text-white/70 font-semibold"><strong className="text-white">60% {t('skills.quiz_weight', 'Scores de Quiz')}</strong> — {t('skills.quiz_weight_desc', 'Précision de la réponse au premier essai.')}</span>
                                </li>
                                <li className="flex items-start gap-4 group">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                                    <span className="text-white/70 font-semibold"><strong className="text-white">20% {t('skills.completion_weight', 'Taux de Complétion')}</strong> — {t('skills.completion_weight_desc', 'Intégralité des modules lus.')}</span>
                                </li>
                                <li className="flex items-start gap-4 group">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                                    <span className="text-white/70 font-semibold"><strong className="text-white">20% {t('skills.consistency_weight', 'Bonus de Cohérence')}</strong> — {t('skills.consistency_weight_desc', 'Temps passé et régularité.')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-2xl shadow-inner">
                        <div className="space-y-2">
                             <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">{t('skills.strategic_advice', 'Conseil Stratégique')}</p>
                             <h4 className="text-2xl font-black text-white tracking-tight">{t('skills.optimize_portfolio', 'Optimisez votre Portfolio')}</h4>
                        </div>
                        <p className="text-white/40 font-medium leading-relaxed italic">
                            {t('skills.quote', '"Le réseau Pi valorise la compétence avant la spéculation. Un score élevé débloque des rôles exclusifs de modération et de certification."')}
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/courses')} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] py-4 rounded-2xl uppercase tracking-widest transition-all">
                                {t('common.guide', 'Guide Complet')}
                            </button>
                            <button onClick={() => navigate('/courses')} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-[10px] py-4 rounded-2xl uppercase tracking-widest transition-all shadow-xl shadow-yellow-500/20">
                                {t('course.next_module', 'Prochain Module')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/[0.02] rounded-full blur-[120px] -mr-80 -mt-80" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-[100px] -ml-40 -mb-40" />
            </Card>
        </div>
    );
};

export default SkillsAnalysisPage;
