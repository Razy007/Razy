import React, { useState } from 'react';
import { Shield, Check, AlertTriangle, Wallet, ArrowRight } from 'lucide-react';
import { Card, Button } from '../components/BaseComponents';
import { ApiService } from '../services/ApiService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Simple Stellar address validation regex (starts with G, 56 chars)
const STELLAR_ADDRESS_REGEX = /^G[A-Z0-9]{55}$/;

export const WalletSetupPage: React.FC = () => {
    const { refreshProfile } = useAuth();
    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
    const [isValidating, setIsValidating] = useState(false);
    const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleValidate = async () => {
        setErrorMsg('');
        setValidationStatus('idle');

        // 1. Basic format check
        if (!STELLAR_ADDRESS_REGEX.test(address)) {
            setValidationStatus('invalid');
            setErrorMsg("Format d'adresse invalide. Doit commencer par 'G' et contenir 56 caractères.");
            return;
        }

        setIsValidating(true);
        try {
            // 2. Server-side validation via Horizon
            const response = await ApiService.validateWallet(address, network);
            
            if (response.data.valid) {
                setValidationStatus('valid');
                toast.success("Adresse wallet validée avec succès !");
            } else {
                setValidationStatus('invalid');
                setErrorMsg(response.data.message || "Impossible de valider cette adresse sur la blockchain.");
            }
        } catch (error) {
            console.error('Wallet validation error:', error);
            setValidationStatus('invalid');
            const apiError = error as { response?: { data?: { message?: string } } };
            setErrorMsg(apiError.response?.data?.message || "Erreur de connexion au serveur de validation.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleSave = async () => {
        if (validationStatus !== 'valid') return;

        try {
            await ApiService.saveWallet({ address, network });
            toast.success("Wallet configuré !");
            await refreshProfile();
            navigate('/shop');
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde du wallet.");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center">
            <div className="max-w-xl w-full space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 bg-yellow-500/10 rounded-full mb-4 ring-1 ring-yellow-500/30">
                        <Wallet size={40} className="text-yellow-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        Configuration <span className="text-yellow-500">Wallet</span>
                    </h1>
                    <p className="text-white/60 text-sm max-w-md mx-auto">
                        Pour effectuer des dépôts et retraits, vous devez lier votre adresse Pi Network officielle.
                    </p>
                </div>

                <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl">
                    <div className="space-y-6">
                        
                        {/* Network Selector */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setNetwork('testnet')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    network === 'testnet' 
                                    ? 'bg-yellow-500/20 border-yellow-500 text-white' 
                                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                }`}
                            >
                                <span className="text-xs font-black uppercase tracking-widest">Testnet</span>
                                <AlertTriangle size={16} className={network === 'testnet' ? 'text-yellow-500' : 'text-white/20'} />
                            </button>
                            <button
                                onClick={() => setNetwork('mainnet')}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                    network === 'mainnet' 
                                    ? 'bg-purple-500/20 border-purple-500 text-white' 
                                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                }`}
                            >
                                <span className="text-xs font-black uppercase tracking-widest">Mainnet</span>
                                <Shield size={16} className={network === 'mainnet' ? 'text-purple-500' : 'text-white/20'} />
                            </button>
                        </div>

                        {/* Address Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Adresse Publique (Clé G...)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value.toUpperCase());
                                        setValidationStatus('idle');
                                    }}
                                    placeholder="G..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-yellow-500 transition-colors uppercase"
                                />
                                {validationStatus === 'valid' && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                                        <Check size={20} />
                                    </div>
                                )}
                            </div>
                            {validationStatus === 'invalid' && (
                                <p className="text-red-400 text-xs font-bold mt-2 flex items-center gap-2 animate-pulse">
                                    <AlertTriangle size={12} />
                                    {errorMsg}
                                </p>
                            )}
                            <p className="text-[10px] text-white/30 italic">
                                Ne jamais entrer votre clé privée (S...). Nous ne vous la demanderons jamais.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 space-y-3">
                            {validationStatus !== 'valid' ? (
                                <Button 
                                    onClick={handleValidate} 
                                    disabled={isValidating || address.length < 50} 
                                    className="w-full py-4 text-xs tracking-widest uppercase font-black"
                                >
                                    {isValidating ? 'Vérification...' : 'Valider le Wallet'}
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSave} 
                                    variant="premium"
                                    className="w-full py-4 text-xs tracking-widest uppercase font-black animate-in fade-in zoom-in duration-300"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Sauvegarder & Continuer</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </Button>
                            )}
                        </div>

                    </div>
                </Card>
            </div>
        </div>
    );
};
