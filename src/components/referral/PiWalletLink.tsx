import React, { useState } from 'react';
import { Wallet, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import ReferralAPI from '../../services/ReferralAPI';

interface PiWalletLinkProps {
  userToken: string;
  userId: string;
  onSuccess?: (rewards: any) => void;
  currentAddress?: string;
}

export const PiWalletLink: React.FC<PiWalletLinkProps> = ({ 
  userToken, 
  userId, 
  onSuccess,
  currentAddress 
}) => {
  const [address, setAddress] = useState(currentAddress || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLinked, setIsLinked] = useState(!!currentAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || address.length < 20) {
      setError('Adresse de wallet invalide. Elle doit commencer par G et contenir 56 caractères.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await ReferralAPI.linkPiWallet(userToken, userId, address);

      if (response.success) {
        setIsLinked(true);
        if (onSuccess) {
          onSuccess({ rewards: response.rewards, walletAddress: address });
        }
      } else {
        setError(response.error || 'Erreur lors de la liaison du wallet');
      }
    } catch (err: any) {
        // Handle error gracefully, possibly extracting message from error object if available
        const errorMessage = err.message || 'Erreur de connexion';
        setError(errorMessage.includes('HTTP 403') ? 'Non autorisé' : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (isLinked) {
    return (
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border border-green-400/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/20 rounded-full">
            <CheckCircle className="text-green-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Pi Wallet Connecté</h3>
            <p className="text-white/70 text-sm mb-2">Votre wallet est lié à votre compte Pi Academy.</p>
            <div className="bg-black/30 px-3 py-2 rounded text-xs font-mono text-green-300 break-all">
              {address}
            </div>
            <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
              <CheckCircle size={12} />
              Récompenses écosystème activées
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 border border-yellow-400/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-400/20 rounded-lg">
            <Wallet className="text-yellow-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Lier votre Pi Wallet</h3>
            <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Multiplicateur 2X Actif 🔥</p>
          </div>
        </div>

        <p className="text-white/80 text-sm mb-6">
          Connectez votre wallet pour débloquer le <strong>Multiplicateur x2</strong> sur tous vos parrainages et recevoir une récompense immédiate de 
          <span className="text-yellow-400 font-bold ml-1">200 XP + 0.002π</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-300 text-xs mb-1 ml-1">Adresse Publique (Clé Publique)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="G..."
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400 transition"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || address.length < 20}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                Lier mon Wallet
                <span className="bg-black/20 text-black px-2 py-0.5 rounded text-xs ml-1">+200 XP</span>
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-white/30 text-xs mt-4">
          Ne partagez jamais votre phrase secrète (Passphrase).
        </p>
      </div>
    </div>
  );
};
