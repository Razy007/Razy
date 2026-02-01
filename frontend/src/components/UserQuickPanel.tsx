import React from 'react';
import { User, Settings, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserQuickPanelProps {
  user: any;
  isPremium: boolean;
  profilePicture: string | null;
  language: string;
  onLanguageChange: (lang: 'fr' | 'en') => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

/**
 * Mobile Quick User Panel
 * Élégant panneau utilisateur pour mobile avec fond gradient cohérent
 * Affiche infos utilisateur, restrictions d'accès, et liens légaux
 */
const UserQuickPanel: React.FC<UserQuickPanelProps> = ({
  user,
  isPremium,
  profilePicture,
  language,
  onLanguageChange,
  onProfileClick,
  onLogout
}) => {
  const { t } = useTranslation();

  // Determine user type for display
  const isGuest = user?.username?.includes('Guest');
  const userType = isGuest ? 'Guest' : (isPremium ? 'Pioneer KYC' : 'Pioneer');

  return (
    <div className="h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black backdrop-blur-xl relative overflow-hidden">
      {/* Decorative blur effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6 pt-20">
        {/* Avatar Section */}
        <div className="mb-4">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 shadow-xl shadow-yellow-400/30 mx-auto"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-yellow-400 shadow-xl shadow-purple-500/30 mx-auto">
              <span className="text-4xl filter drop-shadow-md">{user?.avatar}</span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <h2 className="text-white font-bold text-lg mb-1">{user?.username}</h2>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isGuest ? 'bg-gray-400' : 'bg-green-400'} animate-pulse`} />
            <p className="text-yellow-400 text-xs font-semibold">{userType}</p>
          </div>
        </div>

        {/* User Status Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <User size={16} className="text-purple-400" />
            {isGuest ? t('quickPanel.guestRestrictions', 'Guest Restrictions') : t('quickPanel.yourAccess', 'Your Access')}
          </h3>
          <div className="space-y-2 text-xs">
            {isGuest ? (
              <>
                <div className="flex items-start gap-2 text-white/60">
                  <span className="text-red-400">⚠️</span>
                  <span>{t('quickPanel.noEarnings', 'No Pi earnings')}</span>
                </div>
                <div className="flex items-start gap-2 text-white/60">
                  <span className="text-red-400">⚠️</span>
                  <span>{t('quickPanel.noStaking', 'No staking allowed')}</span>
                </div>
                <div className="flex items-start gap-2 text-white/60">
                  <span className="text-red-400">⚠️</span>
                  <span>{t('quickPanel.noPosting', 'No social posting')}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-yellow-400 text-xs font-semibold">
                    💡 {t('quickPanel.upgradePrompt', 'Connect with Pi Network to unlock all features!')}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2 text-green-400">
                  <span>✅</span>
                  <span>{t('quickPanel.earningEnabled', 'Pi earnings unlocked')}</span>
                </div>
                <div className="flex items-start gap-2 text-green-400">
                  <span>✅</span>
                  <span>{t('quickPanel.stakingEnabled', 'Staking available')}</span>
                </div>
                <div className="flex items-start gap-2 text-green-400">
                  <span>✅</span>
                  <span>{t('quickPanel.socialEnabled', 'Full social access')}</span>
                </div>
                {!isPremium && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-purple-400 text-xs font-semibold">
                      👑 {t('quickPanel.kycPrompt', 'Complete KYC for unlimited staking & withdrawals')}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Language Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe size={14} className="text-white/70" />
            <span className="text-white/70 text-xs uppercase tracking-wider">{t('settings.language', 'Language')}</span>
          </div>
          <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-md">
            <button
              onClick={() => onLanguageChange('fr')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition ${
                language === 'fr'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              🇫🇷 FR
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition ${
                language === 'en'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 mb-auto">
          <button
            onClick={onProfileClick}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg p-3 flex items-center gap-3 transition-all border border-white/10"
          >
            <User size={18} className="text-purple-400" />
            <span className="text-white font-semibold text-sm">{t('nav.profile', 'Profile')}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md rounded-lg p-3 flex items-center gap-3 transition-all border border-red-500/30"
          >
            <LogOut size={18} className="text-red-400" />
            <span className="text-red-300 font-semibold text-sm">{t('profilePage.logout', 'Logout')}</span>
          </button>
        </div>

        {/* Legal Footer */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="text-center space-y-2">
            <p className="text-white/40 text-[10px]">
              © 2025 Academy of Pi
            </p>
            <p className="text-white/30 text-[9px]">
              {t('quickPanel.legalNotice', 'Part of Pi Network Ecosystem')}
            </p>
            <div className="flex items-center justify-center gap-3 text-[9px] text-white/40">
              <a href="/privacy" className="hover:text-yellow-400 transition">Privacy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-yellow-400 transition">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQuickPanel;
