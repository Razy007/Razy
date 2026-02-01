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
            lastRechargeTime: Date.now(),
            rechargeRate: RECHARGE_RATE_PER_HOUR,
            restBonus: 0
        };
    },

    // Calculate current energy based on time elapsed
    calculateCurrentEnergy(state: EnergyState): EnergyState {
        // SECURITY GUARD: Prevent crash
        if (!state) {
            return this.getInitialState();
        }

        const now = Date.now();
        const lastRecharge = state.lastRechargeTime || now; // Fallback
        const timeDiffMs = now - lastRecharge;
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

        // Apply Rest Bonus if away for long enough
        let bonus = 0;
        if (timeDiffHours >= REST_BONUS_THRESHOLD_HOURS) {
            bonus = 20; // Bonus energy for resting
        }

        const energyRecovered = Math.floor(timeDiffHours * (state.rechargeRate || RECHARGE_RATE_PER_HOUR));
        
        // If no recovery needed or possible, just update time
        if ((state.current || 0) >= (state.max || MAX_ENERGY)) {
             return {
                ...state,
                lastRechargeTime: now
            };
        }

        const newCurrent = Math.min((state.max || MAX_ENERGY) + bonus, (state.current || 0) + energyRecovered);

        return {
            ...state,
            current: newCurrent,
            lastRechargeTime: energyRecovered > 0 ? now : lastRecharge
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
        if (state.current >= state.max) return 0;
        
        const msPerPoint = (60 * 1000 * 60) / (state.rechargeRate || RECHARGE_RATE_PER_HOUR);
        const now = Date.now();
        const timeSinceRecharge = now - state.lastRechargeTime;
        
        return Math.max(0, msPerPoint - timeSinceRecharge);
    }
};
