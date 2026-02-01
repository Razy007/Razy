import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShoppingCart } from 'lucide-react';
import { EnergyState } from '../../types';
import { EnergySystem } from '../../services/edu/EnergySystem';

interface EnergyHeaderProps {
    energy: EnergyState;
    onOpenShop: () => void;
}

export const EnergyHeader: React.FC<EnergyHeaderProps> = ({ energy, onOpenShop }) => {
    const [currentEnergy, setCurrentEnergy] = useState(energy);
    const [timeToNext, setTimeToNext] = useState(0);

    useEffect(() => {
        // Update energy display every second
        const interval = setInterval(() => {
            const updated = EnergySystem.calculateCurrentEnergy(energy);
            setCurrentEnergy(updated);
            setTimeToNext(EnergySystem.getTimeToNextPoint(updated));
        }, 1000);

        return () => clearInterval(interval);
    }, [energy]);

    const percentage = (currentEnergy.current / currentEnergy.max) * 100;
    const isLow = percentage < 30;
    const isCritical = percentage < 10;

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-3">
            {/* Energy Display */}
            <div className="relative group">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    isCritical 
                        ? 'bg-red-500/20 border-red-500 animate-pulse' 
                        : isLow 
                        ? 'bg-orange-500/20 border-orange-500' 
                        : 'bg-yellow-400/20 border-yellow-400'
                }`}>
                    <Zap 
                        size={20} 
                        className={`${
                            isCritical ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-yellow-400'
                        } ${currentEnergy.current < currentEnergy.max ? 'animate-pulse' : ''}`}
                    />
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                            <span className={`font-bold text-lg ${
                                isCritical ? 'text-red-300' : isLow ? 'text-orange-300' : 'text-yellow-300'
                            }`}>
                                {Math.floor(currentEnergy.current)}
                            </span>
                            <span className="text-white/60 text-xs">/ {currentEnergy.max}</span>
                        </div>
                        {currentEnergy.current < currentEnergy.max && (
                            <div className="flex items-center gap-1 text-xs text-white/50">
                                <Clock size={10} />
                                <span>{formatTime(timeToNext)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Energy Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${
                            isCritical ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/95 text-white text-xs rounded-lg p-3 hidden group-hover:block w-64 z-50 border border-white/20">
                    <p className="font-bold mb-2">⚡ Système d'Énergie</p>
                    <p className="text-white/70 mb-2">
                        L'énergie se régénère automatiquement : <span className="text-yellow-400">+10⚡/heure</span>
                    </p>
                    <p className="text-white/70">
                        Bonus repos (12h+) : <span className="text-green-400">+20⚡</span>
                    </p>
                    {isLow && (
                        <p className="text-orange-400 mt-2 font-semibold">
                            ⚠️ Énergie faible ! Visitez la boutique pour recharger.
                        </p>
                    )}
                </div>
            </div>

            {/* Shop Button */}
            <button
                onClick={onOpenShop}
                className={`p-2 rounded-lg transition-all ${
                    isLow 
                        ? 'bg-yellow-500/30 hover:bg-yellow-500/50 border-2 border-yellow-400 animate-pulse' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
                title="Boutique d'Énergie"
            >
                <ShoppingCart size={20} className={isLow ? 'text-yellow-400' : 'text-white'} />
            </button>
        </div>
    );
};
