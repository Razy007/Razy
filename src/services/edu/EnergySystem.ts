import { EnergyState } from '../../types';

const MAX_ENERGY = 100;
const RECHARGE_RATE_PER_HOUR = 10;
const REST_BONUS_THRESHOLD_HOURS = 12;

export const EnergySystem = {
    // Initialize default state
    getInitialState(): EnergyState {
        return {
            current: MAX_ENERGY,
            max: MAX_ENERGY,
            lastRechargeTime: Date.now()
        };
    },

    // Calculate current energy based on time elapsed
    calculateCurrentEnergy(state: EnergyState): EnergyState {
        const now = Date.now();
        const timeDiffMs = now - state.lastRechargeTime;
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

        // Apply Rest Bonus if away for long enough
        let bonus = 0;
        if (timeDiffHours >= REST_BONUS_THRESHOLD_HOURS) {
            bonus = 20; // Bonus energy for resting
        }

        const energyRecovered = Math.floor(timeDiffHours * RECHARGE_RATE_PER_HOUR);
        
        // If no recovery needed or possible, just update time
        if (state.current >= state.max) {
             return {
                ...state,
                lastRechargeTime: now
            };
        }

        const newCurrent = Math.min(state.max + bonus, state.current + energyRecovered);

        return {
            ...state,
            current: newCurrent,
            // Only update time if we actually recovered something or hit max
            // To prevent "losing" partial hours, strictly we might want to keep the remainder, 
            // but for simplicity we reset the clock if we added energy.
            lastRechargeTime: energyRecovered > 0 ? now : state.lastRechargeTime
        };
    },

    // Consumes energy if available
    consumeUnsafe(state: EnergyState, amount: number): EnergyState {
        // First bring state up to date
        const freshState = this.calculateCurrentEnergy(state);
        
        if (freshState.current < amount) {
            return freshState; // Not enough energy, return as is (controller should check)
        }

        return {
            ...freshState,
            current: freshState.current - amount,
            // lastRechargeTime remains the same (recharge continues)
        };
    },
    
    hasEnoughEnergy(state: EnergyState, amount: number): boolean {
        const freshState = this.calculateCurrentEnergy(state);
        return freshState.current >= amount;
    },
    
    getTimeToNextPoint(state: EnergyState): number {
        // Returns milliseconds until next 1 point recharge
        // Rate: 10 points / 60 min = 1 point / 6 min
        if (state.current >= state.max) return 0;
        
        const msPerPoint = (60 * 1000 * 60) / RECHARGE_RATE_PER_HOUR;
        const now = Date.now();
        const timeSinceRecharge = now - state.lastRechargeTime;
        
        return Math.max(0, msPerPoint - timeSinceRecharge);
    }
};
