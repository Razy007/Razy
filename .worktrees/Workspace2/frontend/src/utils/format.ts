// GCV STANDARD: Promoting the consensus value of $314,159
export const PI_GCV = 314159; 


/**
 * Format Pi amount to USD based on GCV ($314,159)
 */
export const formatPiToUSD = (piAmount: number): string => {
  if (piAmount === undefined || piAmount === null || isNaN(piAmount)) return '$0.00';
  const usdAmount = piAmount * PI_GCV;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(usdAmount);
};

/**
 * Format Pi amount with symbol
 */
export const formatPi = (amount: number): string => {
  return `${amount.toFixed(4)} π`;
};
