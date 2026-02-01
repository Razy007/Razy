/**
 * 🔒 QUIZ ANSWERS - SERVER SIDE ONLY
 * Ne JAMAIS exposer au client
 */

export const QUIZ_ANSWERS: Record<string, number> = {
  // Cours 1: Pi Network Essentials (50 questions)
  'q-pi-intro-1': 0,
  'q-pi-intro-2': 1,
  'q-pi-intro-3': 2,
  'q-pi-intro-4': 1,
  'q-pi-intro-5': 1,
  'q-pi-intro-6': 1,
  'q-pi-intro-7': 1,
  'q-pi-intro-8': 2,
  'q-pi-intro-9': 2,
  'q-pi-intro-10': 1,
  'q-pi-intro-11': 2,
  'q-pi-intro-12': 1,
  'q-pi-intro-13': 2,
  'q-pi-intro-14': 1,
  'q-pi-intro-15': 1,
  'q-pi-intro-16': 2,
  'q-pi-intro-17': 1,
  'q-pi-intro-18': 1,
  'q-pi-intro-19': 2,
  'q-pi-intro-20': 1,
  'q-pi-intro-21': 0,
  'q-pi-intro-22': 1,
  'q-pi-intro-23': 1,
  'q-pi-intro-24': 1,
  'q-pi-intro-25': 1,
  'q-pi-intro-26': 1,
  'q-pi-intro-27': 1,
  'q-pi-intro-28': 1,
  'q-pi-intro-29': 1,
  'q-pi-intro-30': 1,
  'q-pi-intro-31': 1,
  'q-pi-intro-32': 1,
  'q-pi-intro-33': 1,
  'q-pi-intro-34': 2,
  'q-pi-intro-35': 1,
  'q-pi-intro-36': 1,
  'q-pi-intro-37': 0,
  'q-pi-intro-38': 1,
  'q-pi-intro-39': 1,
  'q-pi-intro-40': 1,
  'q-pi-intro-41': 1,
  'q-pi-intro-42': 1,
  'q-pi-intro-43': 1,
  'q-pi-intro-44': 0,
  'q-pi-intro-45': 0,
  'q-pi-intro-46': 0,
  'q-pi-intro-47': 1,
  'q-pi-intro-48': 0,
  'q-pi-intro-49': 0,
  'q-pi-intro-50': 0,

  // Cours 2: Wallet Mastery
  'q-wallet-1': 2,
  'q-wallet-2': 0,
  'q-wallet-3': 1,
  'q-wallet-4': 0,
  'q-wallet-5': 1,
  'q-wallet-6': 2,
  'q-wallet-7': 0,
  'q-wallet-8': 2,
  'q-wallet-9': 1,
  'q-wallet-10': 0,

  // Cours 3: Safety/Anti-Scam
  'q-safety-1': 0,
  'q-safety-2': 1,
  'q-safety-3': 2,
  'q-safety-4': 0,
  'q-safety-5': 1,
  'q-safety-6': 2,
  'q-safety-7': 0,
  'q-safety-8': 1,
  'q-safety-9': 2,
  'q-safety-10': 0,

  // Cours 4: KYC
  'q-kyc-1': 1,
  'q-kyc-2': 0,
  'q-kyc-3': 2,
  'q-kyc-4': 1,
  'q-kyc-5': 0,
  'q-kyc-6': 1,
  'q-kyc-7': 2,
  'q-kyc-8': 0,
  'q-kyc-9': 1,
  'q-kyc-10': 2,

  // Note: Ajouter toutes les autres questions ici
  // Cette liste doit matcher EXACTEMENT questionBank.ts
};

/**
 * Valide une réponse
 */
export function validateAnswer(questionId: string, userAnswer: number): boolean {
  const correctAnswer = QUIZ_ANSWERS[questionId];
  if (correctAnswer === undefined) {
    throw new Error(`Question ${questionId} not found in answers map`);
  }
  return userAnswer === correctAnswer;
}
