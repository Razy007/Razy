/**
 * 🔒 SECURITY GATEWAY
 * Critical security layer to prevent unauthorized data manipulation.
 * 
 * RULE: User data (XP, Balance, Items, Progression) MUST NEVER be reset/modified
 * without the Master Password.
 */

const MASTER_HASH = "Victoryeyes@@@007!"; // In production, this should be hashed/env var, but user specifically requested this pass.

export const SecurityGateway = {
    /**
     * Verifies the master password before allowing a critical action.
     * @param actionName Name of the action being attempted (for logging)
     * @returns boolean - True if authorized, False if denied.
     */
    authorizeCriticalAction: (actionName: string): boolean => {
        const input = prompt(`🛑 SECURITY ALERT \n\nAction: ${actionName}\n\nThis is a DESTRUCTIVE action. Enter Master Password to proceed:`);
        
        if (input === MASTER_HASH) {
            console.warn(`[SECURITY] Critical action '${actionName}' AUTHORIZED.`);
            return true;
        } else {
            console.error(`[SECURITY] Critical action '${actionName}' DENIED. Invalid password.`);
            alert("⛔ ACCESS DENIED. Invalid Security Credentials.");
            return false;
        }
    },

    /**
     * Validates if a user progress reset is allowed.
     * This makes it virtually impossible to accidentally reset data.
     */
    validateReset: (): boolean => {
        return SecurityGateway.authorizeCriticalAction("RESET_USER_PROGRESS");
    }
};
