import React from 'react';
import { Wallet, TrendingUp, ArrowUpRight, Lock, X } from 'lucide-react';
import { formatPiToUSD } from '../../utils/format';

interface InternalWalletProps {
    piBalance: number; // Educational Balance
    transferableBalance?: number; // Real Mainnet Balance
    xp?: number;
    level?: number;
    onClose?: () => void;
}

import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export const InternalWallet: React.FC<InternalWalletProps> = ({ piBalance, transferableBalance = 0, xp: _xp, level, onClose }) => {
    const { t } = useTranslation();
    const { user, refreshProfile } = useAuth();
    const [calcAmount, setCalcAmount] = React.useState<string>('1');
    
    // GCV Value for Education
    const educationUsdEquiv = formatPiToUSD(piBalance);
    // GCV Value for Real Balance
    const realUsdEquiv = formatPiToUSD(transferableBalance);
    const calcUsd = formatPiToUSD(parseFloat(calcAmount) || 0);
    
    // Withdrawal threshold (minimum withdrawal amount)
    const withdrawalThreshold = 0.5;

    // --- NEW LOGIC: Deposit & Withdrawal Handling ---
    const handleDeposit = async () => {
        // En prod, utiliseriez une vraie modale. Ici simple prompt pour V1.
        const amountStr = window.prompt(t('internalWallet.deposit_prompt', "Combien de Pi voulez-vous déposer ? (Ex: 1, 10, 100)"));
        if (!amountStr) return;
        
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert(t('internalWallet.invalid_amount', "Montant invalide"));
            return;
        }

        try {
            alert(t('internalWallet.launching_tx', { amount }));
            // TODO: Appeler Pi.createPayment
        } catch (e) {
            alert(t('internalWallet.deposit_error', "Erreur lors de l'initialisation du paiement"));
        }
    };

    const handleWithdraw = async () => {
        if (transferableBalance < withdrawalThreshold) {
            alert(t('internalWallet.insufficient_real_balance', { threshold: withdrawalThreshold }));
            return;
        }

        const amountStr = window.prompt(t('internalWallet.withdraw_prompt', { max: transferableBalance.toFixed(4) }), transferableBalance.toString());
        if (!amountStr) return;
        const amount = parseFloat(amountStr);

        if (isNaN(amount) || amount <= 0 || amount > transferableBalance) {
            alert(t('internalWallet.invalid_amount', "Montant invalide"));
            return;
        }

        const walletAddress = window.prompt(t('internalWallet.wallet_address_prompt', "Entrez votre adresse de wallet Pi pour le retrait (Commence par G...) :"));
        if (!walletAddress) return;

        if (!walletAddress.startsWith('G') || walletAddress.length < 20) {
           alert(t('internalWallet.invalid_address', "Adresse invalide. Vérifiez votre Public Key."));
           return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://api.pioneeracademy.academy';
            
            const response = await fetch(`${API_URL}/api/economy/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
                },
                body: JSON.stringify({
                    amount,
                    walletAddress
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(t('internalWallet.request_sent', { amount, id: data.request._id }));
                if (refreshProfile) refreshProfile();
                if (onClose) onClose();
            } else {
                alert(t('internalWallet.request_error', { message: data.message || 'Impossible de traiter la demande.' }));
            }
        } catch (error) {
             console.error(error);
             alert(t('internalWallet.connection_error', "Erreur de connexion au serveur."));
        }
    };
    // ------------------------------------------------

    return (
        <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 space-y-6 animate-in zoom-in duration-300 shadow-3xl overflow-hidden relative max-w-md w-full mx-auto max-h-[85vh] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 border border-yellow-500/20 shadow-inner">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs leading-none mb-1">{t('internalWallet.title', "Portefeuille Gaming")}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t('internalWallet.app_gains', "Gains de l'Application")}</p>
                          {level && (
                            <div className="flex flex-col">
                              <span className="bg-yellow-500/20 text-yellow-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-yellow-500/30 w-fit">
                                LVL {level}
                              </span>
                            </div>
                          )}
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-50">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <div className="overflow-y-auto pr-1 space-y-4 scrollbar-hide flex-grow pb-4">
                {/* EDUCATIONAL BALANCE (NON-LIQUID) */}
                <div className="bg-white/5 border border-white/5 rounded-3xl p-4 md:p-5 relative z-10 group hover:border-white/10 transition-colors shrink-0">
                    <div className="flex justify-between items-start mb-2 text-white/30 uppercase font-black text-[8px] tracking-[0.2em]">
                        <span className="flex items-center gap-2"><Lock size={10} /> {t('internalWallet.educ_balance', "Solde Éducatif (Non-Liquide)")}</span>
                        <span className="text-yellow-500/50 flex items-center gap-1">
                            <span className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></span>
                            {t('internalWallet.real_time', "Temps Réel")}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl md:text-3xl font-black text-white tracking-tighter truncate opacity-80">{piBalance.toFixed(7)}</span>
                        <span className="text-lg font-black text-yellow-500 opacity-60">π</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                         <span className="text-[9px] md:text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg font-bold border border-yellow-500/20">
                            ≈ {educationUsdEquiv} (Valeur Théorique)
                         </span>
                    </div>
                </div>

                 {/* MAINNET BALANCE (LIQUID) */}
                 <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-4 md:p-5 relative z-10 shadow-inner shrink-0">
                    <div className="flex justify-between items-start mb-2 text-green-400/50 uppercase font-black text-[8px] tracking-[0.2em]">
                        <span>{t('internalWallet.mainnet_balance', "Solde Mainnet (Retirable)")}</span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[8px]">{t('internalWallet.liquid', "LIQUIDE")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-black text-white tracking-tighter truncate">{transferableBalance.toFixed(7)}</span>
                        <span className="text-lg font-black text-green-500">π</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm md:text-md font-bold text-green-400">{realUsdEquiv}</span>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none text-right flex-1">{t('internalWallet.est_value_gcv', "Valeur Estimée GCV")}</span>
                    </div>
                </div>

                {/* Interactive Calculator Section */}
                <div className="bg-white/5 border border-white/5 rounded-3xl p-4 space-y-4 relative z-10 shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className="text-blue-400" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('internalWallet.calc_gcv', "Calculatrice GCV Express")}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">{t('internalWallet.pi_amount', "Montant Pi")}</p>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={calcAmount}
                                    onChange={(e) => setCalcAmount(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm font-black text-white outline-none focus:border-yellow-500/50 transition-colors"
                                    placeholder="1.0"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-yellow-500/30">π</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">{t('internalWallet.usd_value', "Valeur USD")}</p>
                            <div className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm font-black text-green-400 truncate">
                                {calcUsd}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 relative z-10 shrink-0 pb-2">
                    <button 
                        onClick={handleDeposit}
                        className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-yellow-500/30 transition-all group active:scale-95"
                    >
                        <ArrowUpRight size={18} className="text-yellow-500 group-hover:rotate-45 transition-transform duration-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-yellow-500 transition-colors">{t('internalWallet.deposit', "Dépôt")}</span>
                    </button>
                    
                    <div className="relative group/tooltip">
                        <button 
                            onClick={handleWithdraw}
                            disabled={transferableBalance < withdrawalThreshold}
                            className={`w-full py-4 flex items-center justify-center gap-2 border rounded-2xl transition-all 
                                ${transferableBalance >= withdrawalThreshold 
                                    ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 cursor-pointer' 
                                    : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed grayscale'
                                }`}
                        >
                            <TrendingUp size={18} className={transferableBalance >= withdrawalThreshold ? "text-green-500" : "text-white"} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                {transferableBalance >= withdrawalThreshold ? t('internalWallet.withdraw', "Retrait") : t('internalWallet.blocked', "Bloqué")}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* FOOTER CLOSE BUTTON mobile mostly */}
            {onClose && (
                <div className="pt-2 border-t border-white/5 shrink-0">
                    <button onClick={onClose} className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/60">
                        {t('common.close', 'Fermer')}
                    </button>
                </div>
            )}
        </div>
    );
};
