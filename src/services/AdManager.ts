/**
 * 📺 AdManager - Gestionnaire de Publicité Responsable (Mock Architecture)
 * 
 * Objectifs:
 * - Fournir un complément de revenu pour les coûts serveurs
 * - Ne jamais dégrader l'expérience d'apprentissage
 * - Récompenser l'utilisateur (Rewarded Ads)
 * - Respecter les politiques Google & Pi Network
 */

import { logMessage, addBreadcrumb } from './monitoring';

export interface AdReward {
    type: 'RETRY' | 'XP_BONUS' | 'ENERGY' | 'COOLDOWN_SKIP';
    amount: number;
    meta?: any;
}

export type AdType = 'REWARDED' | 'INTERSTITIAL';

interface AdState {
    adsWatchedToday: number;
    lastAdTimestamp: number;
    dailyCap: number; // 3-5 pubs max par jour pour éviter l'abus
    lastRetryTimestamp?: number; // ⏳ Timestamp du dernier retry sponsorisé
}

// Simulation du stockage local pour les stats pub
const AD_STORAGE_KEY = 'pi_academy_ad_stats';

class AdManagerService {
    private state: AdState;
    private isInitialized: boolean = false;

    constructor() {
        this.state = this.loadState();
        this.resetDailyStatsIfNeeded();
    }

    private loadState(): AdState {
        const stored = localStorage.getItem(AD_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Migration for new field
            if (!parsed.lastRetryTimestamp) parsed.lastRetryTimestamp = 0;
            return parsed;
        }
        return {
            adsWatchedToday: 0,
            lastAdTimestamp: 0,
            dailyCap: 5, // Limite raisonnable
            lastRetryTimestamp: 0
        };
    }

    private saveState() {
        localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(this.state));
    }

    private resetDailyStatsIfNeeded() {
        const lastDate = new Date(this.state.lastAdTimestamp).getDate();
        const today = new Date().getDate();
        
        if (lastDate !== today) {
            this.state.adsWatchedToday = 0;
            this.saveState();
        }
    }

    /**
     * Initialiser le SDK Publicitaire (Google AdMob / AdSense)
     */
    public init() {
        if (this.isInitialized) return;
        
        console.log('📡 AdManager: Initializing Ad Network...');
        // Ici: Code d'initialisation AdMob/AdSense
        // window.adsbygoogle = window.adsbygoogle || [];
        
        this.isInitialized = true;
    }

    /**
     * Vérifier si une publicité est disponible pour un type de récompense spécifique
     */
    public isRewardAvailable(rewardType: string): boolean {
        this.resetDailyStatsIfNeeded();
        
        if (this.state.adsWatchedToday >= this.state.dailyCap) {
            return false;
        }

        if (rewardType === 'RETRY') {
            const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 heures
            if (Date.now() - (this.state.lastRetryTimestamp || 0) < COOLDOWN_MS) {
                return false;
            }
        }

        return true;
    }

    /**
     * Vérifier si une publicité est disponible (Générique)
     */
    public canShowAd(type: AdType = 'REWARDED'): boolean {
        return this.isRewardAvailable('GENERIC');
    }

    /**
     * Montrer une publicité récompensée
     */
    public showRewardedAd(reward: AdReward): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.isRewardAvailable(reward.type)) {
                if (reward.type === 'RETRY') {
                    const COOLDOWN_MS = 6 * 60 * 60 * 1000;
                    const remainingHours = ((COOLDOWN_MS - (Date.now() - (this.state.lastRetryTimestamp || 0))) / (1000 * 60 * 60)).toFixed(1);
                    alert(`⏳ Limite atteinte: Un retry sponsorisé toutes les 6h.\nRevenez dans ${remainingHours}h.`);
                } else {
                    alert("🚫 Plus de publicités disponibles pour aujourd'hui. Revenez demain !");
                }
                resolve(false);
                return;
            }

            console.log(`📺 AdManager: Showing Rewarded Ad for ${reward.type}`);

            // Simulation de l'interface publicitaire
            const confirmWatch = window.confirm(
                `📺 PUBLICITÉ SPONSORISÉE\n\n` +
                `Regardez une courte vidéo pour obtenir :\n` +
                `🎁 ${this.formatRewardText(reward)}\n\n` +
                `Cela aide à payer les serveurs et garder l'app gratuite.\n` +
                `Continuer ?`
            );

            if (confirmWatch) {
                // Simulation du chargement et de la durée
                // Dans une vraie app, on appelle adMob.show()
                
                setTimeout(() => {
                    alert(`✅ Merci ! Récompense débloquée : ${this.formatRewardText(reward)}`);
                    
                    this.state.adsWatchedToday++;
                    this.state.lastAdTimestamp = Date.now();
                    
                    if (reward.type === 'RETRY') {
                        this.state.lastRetryTimestamp = Date.now();
                    }
                    
                    this.saveState();
                    
                    // Logger l'événement pour analytics
                    this.logAdEvent('impression', reward.type);
                    this.logAdEvent('reward_claimed', reward.type);
                    
                    resolve(true); 
                }, 1500); // 1.5s délai fake
            } else {
                console.log('❌ AdManager: User cancelled ad');
                resolve(false);
            }
        });
    }

    /**
     * Simuler une bannière interstitielle (très rare)
     */
    public showInterstitial(): Promise<void> {
        return new Promise((resolve) => {
            // Logique pour montrer une pub plein écran passible
            // Uniquement si nécessaire et non intrusif
            console.log('📺 AdManager: Showing Interstitial (skipped for UX)');
            resolve();
        });
    }

    private formatRewardText(reward: AdReward): string {
        switch (reward.type) {
            case 'RETRY': return "1 Retry Gratuit (80% des gains)"; // Mise à jour techte
            case 'XP_BONUS': return `+${reward.amount} XP Bonus`;
            case 'ENERGY': return `+${reward.amount} Énergie`;
            case 'COOLDOWN_SKIP': return "Passer le temps d'attente";
            default: return "Récompense";
        }
    }


    private logAdEvent(event: string, type: string) {
        // Connecter ici à Firebase Analytics ou autre
        console.log(`📊 AdMetric: ${event} [${type}]`);
        addBreadcrumb(`Ad Event: ${event}`, { type });
        if (event === 'reward_claimed') {
            logMessage(`Ad Reward Claimed: ${type}`, 'info');
        }
    }

    public getStats() {
        return this.state;
    }
}

export const AdManager = new AdManagerService();
