import React from 'react';
import { Shield, CheckCircle, Crown, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type UserStatus = 'guest' | 'pioneer_non_kyc' | 'pioneer_kyc';

interface UserBadgeProps {
    status: UserStatus;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
}

interface BadgeConfig {
    icon: React.ReactNode;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ 
    status, 
    size = 'medium', 
    showLabel = true 
}) => {
    const { t } = useTranslation();

    const BADGE_CONFIGS: Record<UserStatus, BadgeConfig> = {
        guest: {
            icon: <User />,
            label: t('badges.guest'),
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/20',
            borderColor: 'border-gray-500',
            description: t('badges.guest_desc')
        },
        pioneer_non_kyc: {
            icon: <Shield />,
            label: t('badges.pioneer'),
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-500',
            description: t('badges.pioneer_desc')
        },
        pioneer_kyc: {
            icon: <Crown />,
            label: t('badges.pioneer_kyc'),
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            borderColor: 'border-yellow-500',
            description: t('badges.pioneer_kyc_desc')
        }
    };

    const config = BADGE_CONFIGS[status];
    
    const sizeClasses = {
        small: 'text-xs p-1',
        medium: 'text-sm p-2',
        large: 'text-base p-3'
    };

    const iconSizes = {
        small: 12,
        medium: 16,
        large: 20
    };

    return (
        <div className="relative group inline-block">
            <div className={`
                flex items-center gap-2 rounded-lg border-2 
                ${config.bgColor} ${config.borderColor} ${sizeClasses[size]}
                transition-all hover:scale-105
            `}>
                <div className={config.color}>
                    {React.cloneElement(config.icon as React.ReactElement, { 
                        size: iconSizes[size] 
                    })}
                </div>
                {showLabel && (
                    <span className={`font-semibold ${config.color}`}>
                        {config.label}
                    </span>
                )}
                {status === 'pioneer_kyc' && (
                    <CheckCircle size={iconSizes[size]} className="text-green-400" />
                )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/95 text-white text-xs rounded-lg p-3 hidden group-hover:block w-64 z-50 border border-white/20 whitespace-normal">
                <p className="font-bold mb-1">{config.label}</p>
                <p className="text-white/70">{config.description}</p>
            </div>
        </div>
    );
};

interface AccessBlockMessageProps {
    requiredStatus: UserStatus;
    currentStatus: UserStatus;
    feature: string;
    onUpgrade?: () => void;
}

export const AccessBlockMessage: React.FC<AccessBlockMessageProps> = ({
    requiredStatus,
    currentStatus,
    feature,
    onUpgrade
}) => {
    const { t } = useTranslation();

    const BADGE_CONFIGS: Record<UserStatus, BadgeConfig> = {
        guest: {
            icon: <User />,
            label: t('badges.guest'),
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/20',
            borderColor: 'border-gray-500',
            description: t('badges.guest_desc')
        },
        pioneer_non_kyc: {
            icon: <Shield />,
            label: t('badges.pioneer'),
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-500',
            description: t('badges.pioneer_desc')
        },
        pioneer_kyc: {
            icon: <Crown />,
            label: t('badges.pioneer_kyc'),
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            borderColor: 'border-yellow-500',
            description: t('badges.pioneer_kyc_desc')
        }
    };

    const currentConfig = BADGE_CONFIGS[currentStatus];
    const requiredConfig = BADGE_CONFIGS[requiredStatus];

    const getUpgradeMessage = () => {
        if (currentStatus === 'guest' && requiredStatus === 'pioneer_non_kyc') {
            return t('badges.upgrade_guest');
        }
        if (currentStatus === 'guest' && requiredStatus === 'pioneer_kyc') {
            return t('badges.upgrade_guest'); // Simplified logic, same message for guest
        }
        if (currentStatus === 'pioneer_non_kyc' && requiredStatus === 'pioneer_kyc') {
            return t('badges.upgrade_kyc');
        }
        return t('badges.upgrade_kyc'); // Default fallback
    };

    return (
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
                <div className="relative">
                    {/* Current Badge */}
                    <div className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-2 rounded-full p-4`}>
                        {React.cloneElement(currentConfig.icon as React.ReactElement, { 
                            size: 32,
                            className: currentConfig.color
                        })}
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <path d="M0 12H35M35 12L28 5M35 12L28 19" stroke="#F59E0B" strokeWidth="2"/>
                        </svg>
                    </div>
                    
                    {/* Required Badge */}
                    <div className={`absolute -right-20 top-0 ${requiredConfig.bgColor} ${requiredConfig.borderColor} border-2 rounded-full p-4`}>
                        {React.cloneElement(requiredConfig.icon as React.ReactElement, { 
                            size: 32,
                            className: requiredConfig.color
                        })}
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
                {t('badges.locked_feature')}
            </h3>
            
            <p className="text-white/80 mb-1">
                <span className="font-semibold">{feature}</span> {t('badges.requires_status').replace('{{feature}}', '')} {' '}
                <span className={`font-bold ${requiredConfig.color}`}>{requiredConfig.label}</span>
            </p>
            
            <p className="text-white/70 text-sm mb-4">
                {getUpgradeMessage()}
            </p>

            {onUpgrade && (
                <button
                    onClick={onUpgrade}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                    {currentStatus === 'guest' ? t('auth.login_pi') : t('badges.upgrade_kyc')}
                </button>
            )}

            {/* Benefits List */}
            <div className="mt-6 bg-black/30 rounded-lg p-4 text-left">
                <p className="text-white/70 text-sm font-semibold mb-2">
                    {t('badges.benefits_title', { status: requiredConfig.label })}
                </p>
                <ul className="text-white/60 text-xs space-y-1">
                    {requiredStatus === 'pioneer_non_kyc' && (
                        <>
                            <li>✅ {t('nav.courses')}</li>
                            <li>✅ {t('nav.leaderboard')}</li>
                            <li>✅ {t('nav.social')}</li>
                        </>
                    )}
                    {requiredStatus === 'pioneer_kyc' && (
                        <>
                            <li>✅ {t('badges.pioneer_kyc_desc')}</li>
                            <li>✅ {t('general.staking')}</li>
                            <li>✅ {t('general.premium')}</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};
