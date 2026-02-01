import React, { useEffect, useState } from 'react';
import { EnergyState } from '../../types';
import { EnergySystem } from '../../services/edu/EnergySystem';
import { Zap, Clock } from 'lucide-react';

interface EnergyDisplayProps {
    energy: EnergyState;
}

export const EnergyDisplay: React.FC<EnergyDisplayProps> = ({ energy }) => {
    const [timeToNext, setTimeToNext] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeToNext(EnergySystem.getTimeToNextPoint(energy));
        }, 1000);
        return () => clearInterval(interval);
    }, [energy]);

    const formatTime = (ms: number) => {
        if (ms <= 0) return '';
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const percent = Math.min(100, (energy.current / energy.max) * 100);

    return (
        <div className="bg-slate-800/80 rounded-full px-4 py-1.5 border border-slate-700 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
                <Zap size={16} className={`${energy.current > 0 ? 'text-yellow-400' : 'text-slate-500'} fill-yellow-400`} />
                <span className="font-bold text-white text-sm">{energy.current}/{energy.max}</span>
            </div>
            
            <div className="hidden sm:block w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {timeToNext > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{formatTime(timeToNext)}</span>
                </div>
            )}
        </div>
    );
};
