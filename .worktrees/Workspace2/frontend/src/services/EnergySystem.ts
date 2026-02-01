// ============================================================================
// ENERGY SYSTEM SERVICE
// Manages daily energy, consumption, recharge, and rest bonuses
// ============================================================================

import { EnergyState } from '../types';

export class EnergySystem {
  private static readonly MAX_ENERGY = 100;
  private static readonly RECHARGE_RATE = 10; // Energy per hour
  private static readonly REST_BONUS = 20; // Bonus for daily login after 8+ hours
  private static readonly REST_THRESHOLD = 8 * 60 * 60 * 1000; // 8 hours in ms

  /**
   * Initialize energy state for a new user
   */
  static initializeEnergy(): EnergyState {
    return {
      current: this.MAX_ENERGY,
      max: this.MAX_ENERGY,
      lastRechargeTime: Date.now(),
      rechargeRate: this.RECHARGE_RATE,
      restBonus: 0
    };
  }

  /**
   * Calculate current energy with automatic recharge
   */
  /**
   * Calculate current energy with automatic recharge
   */
  static getCurrentEnergy(energyState: EnergyState): EnergyState {
    // SECURITY GUARD: Prevent crash if state is undefined
    if (!energyState) {
        return this.initializeEnergy();
    }

    const now = Date.now();
    // Fallback if lastRechargeTime is missing
    const lastRecharge = energyState.lastRechargeTime || now;
    
    const timeSinceRecharge = now - lastRecharge;
    const hoursElapsed = timeSinceRecharge / (1000 * 60 * 60);
    
    // Calculate recharged energy
    const rechargedAmount = Math.floor(hoursElapsed * (energyState.rechargeRate || this.RECHARGE_RATE));
    const newCurrent = Math.min(
      (energyState.current || 0) + rechargedAmount,
      energyState.max || this.MAX_ENERGY
    );

    // Check for rest bonus (daily login after 8+ hours)
    let restBonus = 0;
    if (timeSinceRecharge >= this.REST_THRESHOLD && newCurrent < (energyState.max || this.MAX_ENERGY)) {
      restBonus = this.REST_BONUS;
    }

    return {
      ...energyState,
      current: Math.min(newCurrent + restBonus, energyState.max || this.MAX_ENERGY),
      max: energyState.max || this.MAX_ENERGY,
      lastRechargeTime: rechargedAmount > 0 ? now : lastRecharge,
      restBonus: restBonus,
      rechargeRate: energyState.rechargeRate || this.RECHARGE_RATE
    };
  }

  /**
   * Consume energy for an activity
   * Returns updated energy state or null if insufficient energy
   */
  static consumeEnergy(
    energyState: EnergyState,
    amount: number
  ): EnergyState | null {
    const currentState = this.getCurrentEnergy(energyState);
    
    if (currentState.current < amount) {
      return null; // Insufficient energy
    }

    return {
      ...currentState,
      current: currentState.current - amount,
      restBonus: 0 // Reset rest bonus after consumption
    };
  }

  /**
   * Check if user has enough energy
   */
  static hasEnoughEnergy(energyState: EnergyState, required: number): boolean {
    const currentState = this.getCurrentEnergy(energyState);
    return currentState.current >= required;
  }

  /**
   * Calculate time until full recharge (in seconds)
   */
  static timeUntilFullRecharge(energyState: EnergyState): number {
    const currentState = this.getCurrentEnergy(energyState);
    const energyNeeded = currentState.max - currentState.current;
    
    if (energyNeeded <= 0) return 0;
    
    const hoursNeeded = energyNeeded / (currentState.rechargeRate || this.RECHARGE_RATE);
    return Math.ceil(hoursNeeded * 3600); // Convert to seconds
  }

  /**
   * Get energy percentage
   */
  static getEnergyPercentage(energyState: EnergyState): number {
    const currentState = this.getCurrentEnergy(energyState);
    return Math.round((currentState.current / currentState.max) * 100);
  }

  /**
   * Premium boost - increase max energy
   */
  static applyPremiumBoost(energyState: EnergyState): EnergyState {
    return {
      ...energyState,
      max: this.MAX_ENERGY + 50, // Premium users get 150 max energy
      rechargeRate: this.RECHARGE_RATE + 5 // Faster recharge
    };
  }

  /**
   * Format energy display string
   */
  static formatEnergyDisplay(energyState: EnergyState): string {
    const current = this.getCurrentEnergy(energyState);
    return `${current.current}/${current.max} ⚡`;
  }

  /**
   * Get recharge time remaining in human-readable format
   */
  static getRechargeTimeDisplay(energyState: EnergyState): string {
    const seconds = this.timeUntilFullRecharge(energyState);
    
    if (seconds === 0) return 'Full';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
