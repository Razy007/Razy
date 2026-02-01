/**
 * 📺 AdManager - Gestionnaire de Publicité (Google AdSense Integration)
 * 
 * Objectifs:
 * - Intégration réelle de Google AdSense
 * - Fallback intelligent si AdBlock est détecté
 * - Récompenser l'utilisateur (Timer-based Reward for Web Display Ads)
 * 
 * ⚠️ IMPORTANT: VOUS DEVEZ REMPLACER LES IDs CI-DESSOUS PAR LES VÔTRES !
 */

import i18n from '../i18n';

// ==========================================
// 🔧 CONFIGURATION AD SENSE - PRODUCTION
// ==========================================
const AD_CONFIG = {
    CLIENT_ID: 'ca-pub-1838729279763813', // ✅ ID Editeur configuré
    SLOT_ID: '9972088627',                // ✅ Slot ID configuré (Pioneer Academy Rewarded Ad)
    TEST_MODE: false                      // ✅ Mode production activé
};

export interface AdReward {
    type: 'RETRY' | 'XP_BONUS' | 'ENERGY' | 'COOLDOWN_SKIP';
    amount: number;
    meta?: Record<string, unknown>;
}

export type AdType = 'REWARDED' | 'INTERSTITIAL';

interface AdState {
    adsWatchedToday: number;
    lastAdTimestamp: number;
    dailyCap: number; 
    lastRetryTimestamp?: number;
}

const AD_STORAGE_KEY = 'pi_academy_ad_stats';

class AdManagerService {
    private state: AdState;
    private isInitialized: boolean = false;
    private scriptLoaded: boolean = false;

    constructor() {
        this.state = this.loadState();
        this.resetDailyStatsIfNeeded();
    }

    private loadState(): AdState {
        const stored = localStorage.getItem(AD_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (!parsed.lastRetryTimestamp) parsed.lastRetryTimestamp = 0;
            return parsed;
        }
        return {
            adsWatchedToday: 0,
            lastAdTimestamp: 0,
            dailyCap: 10,
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
     * Initialiser le SDK Google AdSense
     */
    public init() {
        if (this.isInitialized) return;
        
        console.log('📡 AdManager: Injecting Google AdSense Script...');
        
        try {
            const script = document.createElement('script');
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.CLIENT_ID}`;
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = () => {
                console.log('✅ AdSense Script Loaded');
                this.scriptLoaded = true;
            };
            script.onerror = (e) => {
                console.warn('⚠️ AdSense Blocked (AdBlocker detected)', e);
            };
            document.head.appendChild(script);
            this.isInitialized = true;
        } catch (err) {
            console.error('AdSense Init Error:', err);
        }
    }

    public isRewardAvailable(rewardType: string): boolean {
        this.resetDailyStatsIfNeeded();
        if (this.state.adsWatchedToday >= this.state.dailyCap) return false;
        
        if (rewardType === 'RETRY') {
            // ⚡ UPDATED: Removed 6h cooldown. 
            // Logic relies on 'dailyCap' (10/day) and 'RetrySystem' (1 per layer).
            // This ensures user can validly retry multiple different courses in a session.
            /* 
            const COOLDOWN_MS = 6 * 60 * 60 * 1000;
            if (Date.now() - (this.state.lastRetryTimestamp || 0) < COOLDOWN_MS) {
                return false;
            }
            */
           return true;
        }
        return true;
    }

    public canShowAd(_type: AdType = 'REWARDED'): boolean {
        return this.isRewardAvailable('GENERIC');
    }

    /**
     * Affiche une "Rewarded Ad" en Web :
     * 1. Ouvre une Modal
     * 2. Affiche un bloc AdSense
     * 3. Lance un Timer (5s)
     * 4. Débloque le bouton "Récupérer récompense"
     */
    public showRewardedAd(reward: AdReward): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.isRewardAvailable(reward.type)) {
                this.handleUnavailable(reward);
                resolve(false);
                return;
            }

            // 1. Create Modal DOM
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; inset: 0; z-index: 10000;
                background: rgba(0,0,0,0.9); backdrop-filter: blur(10px);
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                animation: fadeIn 0.3s ease-out;
            `;

            // 2. Content Container
            const container = document.createElement('div');
            container.style.cssText = `
                background: #0f172a; border: 1px solid #334155; border-radius: 16px;
                padding: 20px; width: 90%; max-width: 400px; text-align: center;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            `;

            // Title
            const title = document.createElement('h3');
            title.textContent = "Sponsorisé";
            title.style.cssText = "color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;";
            container.appendChild(title);

            // Ad Container (The Google Ad Unit)
            const adSlot = document.createElement('div');
            adSlot.style.cssText = "width: 100%; min-height: 250px; background: #1e293b; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; overflow: hidden; border-radius: 8px;";
            
            // Insert <ins> tag
            if (AD_CONFIG.TEST_MODE) {
                adSlot.innerHTML = `<div style="color:white; padding: 20px;">[TEST MODE]<br>AD_SPACE<br>(AdSense Unit #${AD_CONFIG.SLOT_ID})</div>`;
            } else {
                const ins = document.createElement('ins');
                ins.className = 'adsbygoogle';
                ins.style.display = 'block';
                ins.setAttribute('data-ad-client', AD_CONFIG.CLIENT_ID);
                ins.setAttribute('data-ad-slot', AD_CONFIG.SLOT_ID);
                ins.setAttribute('data-ad-format', 'auto');
                ins.setAttribute('data-full-width-responsive', 'true');
                adSlot.appendChild(ins);
            }
            container.appendChild(adSlot);

            // Timer / Button
            const btn = document.createElement('button');
            btn.textContent = "Patientez 5s...";
            btn.disabled = true;
            btn.style.cssText = `
                width: 100%; padding: 12px; border-radius: 8px; font-weight: bold; border: none;
                background: #334155; color: #94a3b8; cursor: not-allowed; transition: all 0.2s;
            `;
            container.appendChild(btn);

            modal.appendChild(container);
            document.body.appendChild(modal);

            // 3. Initialize Ad
            if (!AD_CONFIG.TEST_MODE) {
                try {
                    // @ts-expect-error Google Ads types not imported
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) { console.error("Ad Push Error", e); }
            }

            // 4. Timer Logic
            let timeLeft = 5;
            const timer = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0) {
                    btn.textContent = `Récompense dans ${timeLeft}s...`;
                } else {
                    clearInterval(timer);
                    btn.textContent = `✨ Récupérer ${this.formatRewardText(reward)}`;
                    btn.disabled = false;
                    btn.style.background = 'linear-gradient(to right, #eab308, #f97316)'; // Yellow/Orange
                    btn.style.color = 'black';
                    btn.style.cursor = 'pointer';
                    btn.style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.4)';
                    
                    // Click handler
                    btn.onclick = () => {
                        this.finishAd(modal, reward, resolve);
                    };
                }
            }, 1000);
        });
    }

    private finishAd(modal: HTMLElement, reward: AdReward, resolve: (val: boolean) => void) {
        // Cleanup
        modal.style.opacity = '0';
        setTimeout(() => document.body.removeChild(modal), 300);

        // Update Stats
        this.state.adsWatchedToday++;
        this.state.lastAdTimestamp = Date.now();
        if (reward.type === 'RETRY') this.state.lastRetryTimestamp = Date.now();
        this.saveState();

        // Log
        this.logAdEvent('impression_complete', reward.type);
        this.logAdEvent('reward_claimed', reward.type);

        resolve(true); 
    }

    private handleUnavailable(reward: AdReward) {
        if (reward.type === 'RETRY') {
             const COOLDOWN_MS = 6 * 60 * 60 * 1000;
             const remainingHours = ((COOLDOWN_MS - (Date.now() - (this.state.lastRetryTimestamp || 0))) / (1000 * 60 * 60)).toFixed(1);
             alert(i18n.t('ads.limit_reached', { hours: remainingHours }));
        } else {
             alert(i18n.t('ads.no_ads'));
        }
    }

    public showInterstitial(): Promise<void> {
        return Promise.resolve();
    }

    private formatRewardText(reward: AdReward): string {
        switch (reward.type) {
            case 'RETRY': return i18n.t('rewards.retry');
            case 'XP_BONUS': return `+${reward.amount} XP`;
            case 'ENERGY': return `+${reward.amount} ⚡`;
            case 'COOLDOWN_SKIP': return "Skip Time";
            default: return "Reward";
        }
    }

    private logAdEvent(event: string, type: string) {
        console.log(`📊 AdMetric: ${event} [${type}]`);
        // Integration Firebase Analytics possible ici
    }

    public getStats() {
        return this.state;
    }
}

export const AdManager = new AdManagerService();
