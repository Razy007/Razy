import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Zap, TrendingUp, Infinity, Clock, DollarSign } from 'lucide-react';
import { EnergyState } from '../../types';

interface EnergyShopProps {
    energy: EnergyState;
    piBalance: number;
    onClose: () => void;
    onPurchase: (productId: string, cost: number, energyGain: number) => void;
}

interface EnergyProduct {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    energyGain: number;
    piCost: number;
    badge?: string;
    popular?: boolean;
    unlimited?: boolean;
}

const ENERGY_PRODUCTS: EnergyProduct[] = [
    {
        id: 'energy_refill_small',
        name: 'Recharge Rapide',
        description: 'Restaure instantanément 50⚡',
        icon: <Zap size={32} className="text-yellow-400" />,
        energyGain: 50,
        piCost: 0.0001,
        badge: 'Populaire',
        popular: true
    },
    {
        id: 'energy_boost_24h',
        name: 'Boost 24h',
        description: 'Double la régénération pendant 24h (+20⚡/h)',
        icon: <TrendingUp size={32} className="text-blue-400" />,
        energyGain: 0, // Special: modifies regen rate
        piCost: 0.0003,
        badge: 'Meilleur Rapport'
    },
    {
        id: 'energy_unlimited_7d',
        name: 'Énergie Illimitée',
        description: 'Énergie infinie pendant 7 jours',
        icon: <Infinity size={32} className="text-purple-400" />,
        energyGain: 0, // Special: unlimited energy
        piCost: 0.001,
        badge: 'Premium',
        unlimited: true
    }
];

export const EnergyShop: React.FC<EnergyShopProps> = ({ energy, piBalance, onClose, onPurchase }) => {
    const { t } = useTranslation();
    const handlePurchase = (product: EnergyProduct) => {
        // Round to 6 decimal places to avoid floating point precision issues
        const balance = Math.round(piBalance * 1000000) / 1000000;
        const cost = Math.round(product.piCost * 1000000) / 1000000;
        
        if (balance < cost) {
            alert(t('shop.insufficient_balance_detail', { cost: product.piCost, balance: piBalance.toFixed(6), missing: (product.piCost - piBalance).toFixed(6) }));
            return;
        }

        if (window.confirm(
            t('shop.confirm_purchase', { 
                productName: product.name, 
                productDesc: product.description, 
                cost: product.piCost, 
                balance: (piBalance - product.piCost).toFixed(6) 
            })
        )) {
            onPurchase(product.id, product.piCost, product.energyGain);
            
            let extra = "";
            if (product.energyGain > 0) {
                extra = t('shop.extra_energy', { amount: product.energyGain });
            } else if (product.id.includes('boost')) {
                extra = t('shop.extra_boost');
            } else if (product.unlimited) {
                extra = t('shop.extra_unlimited');
            }
            
            alert(t('shop.purchase_success', { productName: product.name, extra }));
            onClose();
        }
    };

    const PI_GCV = 314.159;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-400/30">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-orange-500 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Zap className="animate-pulse" />
                            Boutique d'Énergie
                        </h2>
                        <p className="text-white/80 text-sm mt-1">Rechargez votre énergie et boostez votre apprentissage</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Current Status */}
                <div className="p-6 bg-black/30 border-b border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={20} className="text-yellow-400" />
                                <span className="text-white/70 text-sm">Énergie Actuelle</span>
                            </div>
                            <p className="text-2xl font-bold text-yellow-400">
                                {Math.floor(energy.current)} / {energy.max}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={20} className="text-green-400" />
                                <span className="text-white/70 text-sm">Solde Pi</span>
                            </div>
                            <p className="text-2xl font-bold text-green-400">
                                {piBalance.toFixed(6)}π
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                                ≈ ${(piBalance * PI_GCV).toFixed(2)} USD
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {ENERGY_PRODUCTS.map((product) => (
                            <div
                                key={product.id}
                                className={`relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all hover:scale-105 hover:shadow-2xl ${
                                    product.popular 
                                        ? 'border-yellow-400 shadow-yellow-400/50' 
                                        : product.unlimited
                                        ? 'border-purple-400 shadow-purple-400/50'
                                        : 'border-white/20'
                                }`}
                            >
                                {/* Badge */}
                                {product.badge && (
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${
                                        product.popular 
                                            ? 'bg-yellow-400 text-black' 
                                            : product.unlimited
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-blue-500 text-white'
                                    }`}>
                                        {product.badge}
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="flex justify-center mb-4 mt-2">
                                    {product.icon}
                                </div>

                                {/* Name */}
                                <h3 className="text-white font-bold text-lg text-center mb-2">
                                    {product.name}
                                </h3>

                                {/* Description */}
                                <p className="text-white/70 text-sm text-center mb-4">
                                    {product.description}
                                </p>

                                {/* Price */}
                                <div className="bg-black/30 rounded-lg p-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70 text-sm">Prix:</span>
                                        <div className="text-right">
                                            <p className="text-yellow-400 font-bold">{product.piCost}π</p>
                                            <p className="text-white/50 text-xs">
                                                ≈ ${(product.piCost * PI_GCV).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Purchase Button */}
                                <button
                                    onClick={() => handlePurchase(product)}
                                    disabled={(Math.round(piBalance * 1000000) / 1000000) < (Math.round(product.piCost * 1000000) / 1000000)}
                                    className={`w-full py-3 rounded-lg font-bold transition-all relative z-10 cursor-pointer ${
                                        (Math.round(piBalance * 1000000) / 1000000) < (Math.round(product.piCost * 1000000) / 1000000)
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : product.popular
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:scale-[1.02] active:scale-95'
                                            : product.unlimited
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95'
                                            : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02] active:scale-95'
                                    }`}
                                >
                                    {(Math.round(piBalance * 1000000) / 1000000) < (Math.round(product.piCost * 1000000) / 1000000) ? 'Solde Insuffisant' : 'Acheter'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Info Section */}
                    <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                        <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                            <Clock size={16} />
                            Régénération Naturelle
                        </h4>
                        <p className="text-white/70 text-sm">
                            Votre énergie se régénère automatiquement à raison de <span className="text-yellow-400 font-bold">+10⚡ par heure</span>.
                            Revenez après 12h d'absence pour un bonus de <span className="text-green-400 font-bold">+20⚡</span>!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
