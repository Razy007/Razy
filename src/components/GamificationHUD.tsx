import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { 
    Achievement, 
    ComboState, 
    ComboSystem, 
    DailyChallenge,
    ChallengeSystem,
    GamificationEngine,
    ACHIEVEMENTS,
    PROGRESSION_MILESTONES
} from '../services/edu/GamificationSystem';

interface GamificationHUDProps {
    userProgress: UserProgress;
    comboState: ComboState;
    dailyChallenges: DailyChallenge[];
    onPowerUpPurchase?: (powerUpId: string) => void;
}

/**
 * 🎮 GAMIFICATION HUD
 * 
 * Interface utilisateur pour afficher:
 * - Progression en temps réel
 * - Combos et streaks
 * - Achievements débloqués
 * - Défis quotidiens
 * - Leaderboard
 */
export const GamificationHUD: React.FC<GamificationHUDProps> = ({
    userProgress,
    comboState,
    dailyChallenges,
    onPowerUpPurchase
}) => {
    const [showAchievements, setShowAchievements] = useState(false);
    const [showChallenges, setShowChallenges] = useState(false);
    const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

    // Calculer la progression vers le prochain niveau
    const progressToNextLevel = (userProgress.xp / userProgress.xpToNext) * 100;

    // Trouver le prochain milestone
    const nextMilestone = PROGRESSION_MILESTONES.find(m => m.level > userProgress.level);

    // Achievements débloqués
    const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked);
    const totalAchievements = ACHIEVEMENTS.length;

    return (
        <div className="gamification-hud">
            {/* ========== BARRE DE PROGRESSION PRINCIPALE ========== */}
            <div className="progress-bar-container">
                <div className="level-badge">
                    <span className="level-number">Niv. {userProgress.level}</span>
                    {nextMilestone && (
                        <span className="next-milestone">{nextMilestone.icon}</span>
                    )}
                </div>
                
                <div className="xp-bar">
                    <div className="xp-fill" style={{ width: `${progressToNextLevel}%` }}>
                        <div className="xp-shine"></div>
                    </div>
                    <span className="xp-text">
                        {userProgress.xp.toLocaleString()} / {userProgress.xpToNext.toLocaleString()} XP
                    </span>
                </div>

                <div className="stats-row">
                    <div className="stat-item">
                        <span className="stat-icon">🔥</span>
                        <span className="stat-value">{userProgress.streak}</span>
                        <span className="stat-label">Jours</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">💰</span>
                        <span className="stat-value">{userProgress.piBalance.toFixed(4)}</span>
                        <span className="stat-label">Pi</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">⚡</span>
                        <span className="stat-value">{userProgress.energy.current}/{userProgress.energy.max}</span>
                        <span className="stat-label">Énergie</span>
                    </div>
                </div>
            </div>

            {/* ========== COMBO DISPLAY ========== */}
            {comboState.active && comboState.current >= 3 && (
                <div className={`combo-display combo-${comboState.current >= 10 ? 'legendary' : comboState.current >= 7 ? 'amazing' : comboState.current >= 5 ? 'great' : 'nice'}`}>
                    <div className="combo-icon">🔥</div>
                    <div className="combo-text">
                        <div className="combo-count">{comboState.current}x COMBO!</div>
                        <div className="combo-label">{ComboSystem.getComboLabel(comboState.current)}</div>
                    </div>
                    <div className="combo-multiplier">+{((comboState.multiplier - 1) * 100).toFixed(0)}% XP</div>
                </div>
            )}

            {/* ========== DÉFIS QUOTIDIENS ========== */}
            <div className="challenges-widget">
                <div className="widget-header" onClick={() => setShowChallenges(!showChallenges)}>
                    <span className="widget-title">🎯 Défis du Jour</span>
                    <span className="widget-toggle">{showChallenges ? '▼' : '▶'}</span>
                </div>
                
                {showChallenges && (
                    <div className="challenges-list">
                        {dailyChallenges.map(challenge => (
                            <div key={challenge.id} className={`challenge-item ${challenge.completed ? 'completed' : ''}`}>
                                <div className="challenge-icon">{challenge.icon}</div>
                                <div className="challenge-info">
                                    <div className="challenge-title">{challenge.title}</div>
                                    <div className="challenge-progress-bar">
                                        <div 
                                            className="challenge-progress-fill" 
                                            style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="challenge-stats">
                                        <span>{challenge.progress}/{challenge.target}</span>
                                        <span className="challenge-reward">+{challenge.xpReward} XP</span>
                                    </div>
                                </div>
                                {challenge.completed && <div className="challenge-checkmark">✓</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ========== ACHIEVEMENTS ========== */}
            <div className="achievements-widget">
                <div className="widget-header" onClick={() => setShowAchievements(!showAchievements)}>
                    <span className="widget-title">🏆 Succès ({unlockedAchievements.length}/{totalAchievements})</span>
                    <span className="widget-toggle">{showAchievements ? '▼' : '▶'}</span>
                </div>

                {showAchievements && (
                    <div className="achievements-grid">
                        {ACHIEVEMENTS.map(achievement => (
                            <div 
                                key={achievement.id} 
                                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} rarity-${achievement.rarity}`}
                                title={achievement.description}
                            >
                                <div className="achievement-icon">{achievement.icon}</div>
                                <div className="achievement-title">{achievement.title}</div>
                                {achievement.unlocked && (
                                    <div className="achievement-badge">✓</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ========== NOTIFICATION D'ACHIEVEMENT ========== */}
            {recentAchievement && (
                <div className="achievement-notification">
                    <div className="notification-content">
                        <div className="notification-icon">{recentAchievement.icon}</div>
                        <div className="notification-text">
                            <div className="notification-title">🎉 Succès Débloqué!</div>
                            <div className="notification-achievement">{recentAchievement.title}</div>
                            <div className="notification-rewards">
                                +{recentAchievement.xpReward} XP | +{recentAchievement.piReward} Pi
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .gamification-hud {
                    position: relative;
                    width: 100%;
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                }

                /* ========== BARRE DE PROGRESSION ========== */
                .progress-bar-container {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 16px;
                }

                .level-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .level-number {
                    font-size: 24px;
                    font-weight: bold;
                    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .next-milestone {
                    font-size: 28px;
                    animation: bounce 2s infinite;
                }

                .xp-bar {
                    position: relative;
                    height: 32px;
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 16px;
                    overflow: hidden;
                    margin-bottom: 12px;
                }

                .xp-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #8b5cf6, #3b82f6);
                    border-radius: 16px;
                    transition: width 0.5s ease;
                    position: relative;
                    overflow: hidden;
                }

                .xp-shine {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    animation: shine 2s infinite;
                }

                .xp-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                }

                .stats-row {
                    display: flex;
                    gap: 16px;
                    justify-content: space-around;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }

                .stat-icon {
                    font-size: 24px;
                }

                .stat-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: white;
                }

                .stat-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                }

                /* ========== COMBO DISPLAY ========== */
                .combo-display {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 12px;
                    margin-bottom: 16px;
                    border: 2px solid;
                    animation: pulse 1s infinite;
                }

                .combo-nice { border-color: #10b981; }
                .combo-great { border-color: #3b82f6; }
                .combo-amazing { border-color: #8b5cf6; }
                .combo-legendary { border-color: #f59e0b; }

                .combo-icon {
                    font-size: 48px;
                    animation: rotate 2s linear infinite;
                }

                .combo-text {
                    flex: 1;
                }

                .combo-count {
                    font-size: 28px;
                    font-weight: bold;
                    color: white;
                }

                .combo-label {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                }

                .combo-multiplier {
                    font-size: 20px;
                    font-weight: bold;
                    color: #10b981;
                }

                /* ========== WIDGETS ========== */
                .challenges-widget,
                .achievements-widget {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                    margin-bottom: 16px;
                    overflow: hidden;
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: rgba(0, 0, 0, 0.2);
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .widget-header:hover {
                    background: rgba(0, 0, 0, 0.3);
                }

                .widget-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: white;
                }

                .widget-toggle {
                    color: rgba(255, 255, 255, 0.6);
                }

                /* ========== CHALLENGES ========== */
                .challenges-list {
                    padding: 12px;
                }

                .challenge-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    margin-bottom: 8px;
                    position: relative;
                }

                .challenge-item.completed {
                    opacity: 0.6;
                }

                .challenge-icon {
                    font-size: 32px;
                }

                .challenge-info {
                    flex: 1;
                }

                .challenge-title {
                    font-size: 14px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 4px;
                }

                .challenge-progress-bar {
                    height: 8px;
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 4px;
                }

                .challenge-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #10b981, #3b82f6);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }

                .challenge-stats {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                }

                .challenge-reward {
                    color: #10b981;
                    font-weight: bold;
                }

                .challenge-checkmark {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    background: #10b981;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                }

                /* ========== ACHIEVEMENTS ========== */
                .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 12px;
                    padding: 12px;
                }

                .achievement-card {
                    aspect-ratio: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    border-radius: 8px;
                    position: relative;
                    transition: transform 0.2s;
                }

                .achievement-card:hover {
                    transform: scale(1.05);
                }

                .achievement-card.locked {
                    background: rgba(0, 0, 0, 0.3);
                    opacity: 0.5;
                    filter: grayscale(1);
                }

                .achievement-card.unlocked {
                    background: rgba(0, 0, 0, 0.4);
                }

                .achievement-card.rarity-common { border: 2px solid #6b7280; }
                .achievement-card.rarity-rare { border: 2px solid #3b82f6; }
                .achievement-card.rarity-epic { border: 2px solid #8b5cf6; }
                .achievement-card.rarity-legendary { border: 2px solid #f59e0b; }

                .achievement-icon {
                    font-size: 36px;
                    margin-bottom: 8px;
                }

                .achievement-title {
                    font-size: 11px;
                    text-align: center;
                    color: white;
                    font-weight: bold;
                }

                .achievement-badge {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 20px;
                    height: 20px;
                    background: #10b981;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                }

                /* ========== NOTIFICATION ========== */
                .achievement-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    animation: slideIn 0.5s ease;
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .notification-icon {
                    font-size: 48px;
                }

                .notification-text {
                    color: white;
                }

                .notification-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 4px;
                }

                .notification-achievement {
                    font-size: 16px;
                    margin-bottom: 4px;
                }

                .notification-rewards {
                    font-size: 14px;
                    opacity: 0.9;
                }

                /* ========== ANIMATIONS ========== */
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }

                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};
