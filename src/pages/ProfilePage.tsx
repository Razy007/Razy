
import React from 'react';
import { Trash2, Copy, Zap, Wallet, Share2, Lock, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User, UserProgress } from '../types';

interface ProfilePageProps {
  user: any;
  userProgress: UserProgress;
  profilePicture: string | null;
  handleProfilePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeProfilePicture: () => void;
  copyToClipboard: (text: string) => void;
  handleLogout: () => void;
  setShowWallet: (show: boolean) => void;
  onSyncProgress?: () => void; // Fonction de synchronisation
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  userProgress,
  profilePicture,
  handleProfilePictureUpload,
  removeProfilePicture,
  copyToClipboard,
  handleLogout,
  setShowWallet,
  onSyncProgress
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        {/* Profile Picture */}
        <div className="relative inline-block mb-4">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-yellow-400 overflow-hidden shadow-lg shadow-purple-500/30">
              <span className="text-7xl leading-none select-none filter drop-shadow-md pb-2">{user?.avatar}</span>
            </div>
          )}
          
          {/* Upload Button */}
          <label className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-2 cursor-pointer transition shadow-lg">
            <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
            <span className="text-lg">📷</span>
          </label>

          {/* Remove Picture Button */}
           {profilePicture && (
             <button onClick={removeProfilePicture} className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 cursor-pointer transition shadow-lg" title={t('profilePage.remove_pic')}>
               <Trash2 size={16} />
             </button>
           )}
        </div>

        <h3 className="text-white text-3xl font-bold mb-2">{user?.username}</h3>
        <p className="text-purple-300">{t('profilePage.title')}</p>
        
        <div className="bg-white/10 rounded-lg p-3 mt-3 inline-block">
          <p className="text-purple-300 text-xs mb-1">User ID</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-yellow-400 font-mono font-bold text-sm">{user?.uid}</p>
            <button onClick={() => copyToClipboard(user?.uid)} className="text-white hover:text-yellow-400"><Copy size={16} /></button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-purple-300 text-xs">{t('stats.level')}</p>
          <p className="text-white text-2xl font-bold">{userProgress.level}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-purple-300 text-xs">{t('stats.streak')}</p>
          <p className="text-white text-2xl font-bold">{userProgress.streak}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-purple-300 text-xs">Courses</p>
          <p className="text-white text-2xl font-bold">{userProgress.completedCourses.length}</p>
        </div>
      </div>

      <div className="space-y-3">
          {/* XP Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
          <div className="bg-purple-500/20 p-2.5 rounded-xl"><Zap className="text-purple-400" size={24} /></div>
          <div className="flex flex-col items-end">
              <span className="text-white/60 text-xs uppercase tracking-wider">{t('stats.xp')}</span>
              <span className="text-2xl font-bold text-white leading-none">{userProgress.xp}</span>
          </div>
          </div>

          {/* Balance Card */}
          <div onClick={() => setShowWallet(true)} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-2xl p-4 border border-orange-500/20 flex items-center justify-between cursor-pointer hover:border-orange-500/40 transition-colors">
          <div className="bg-orange-500/20 p-2.5 rounded-xl"><Wallet className="text-orange-400" size={24} /></div>
          <div className="flex flex-col items-end">
              <span className="text-white/60 text-xs uppercase tracking-wider">{t('stats.balance')}</span>
              <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-orange-400 leading-none">{userProgress.piBalance.toFixed(4)}</span>
              <span className="text-orange-400 font-bold text-xs">π</span>
              </div>
          </div>
          </div>
          
          {/* Referral */}
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl p-4 border border-green-400/30">
          <p className="text-green-400 font-semibold mb-2 flex items-center gap-2"><Share2 size={16} /> {t('profilePage.referral_code')}</p>
          <div className="flex items-center gap-2">
              <p className="text-white font-mono font-bold text-lg flex-1">{userProgress.referralCode}</p>
              <button onClick={() => copyToClipboard(userProgress.referralCode)} className="bg-green-400 text-black px-3 py-1 rounded-lg font-bold"><Copy size={16} /></button>
          </div>
          </div>
      </div>

      {/* Sync Button */}
      {onSyncProgress && (
        <div className="mt-4">
          <button 
              onClick={() => {
                onSyncProgress();
                // Feedback visuel
                const btn = document.activeElement as HTMLButtonElement;
                if (btn) {
                  btn.innerText = '✅ Synchronized!';
                  setTimeout(() => {
                    btn.innerHTML = '<svg class="inline mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>Synchronize Data';
                  }, 2000);
                }
              }}
              className="w-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/30 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
              <RefreshCw size={16} /> {t('profilePage.sync_data', { defaultValue: 'Synchronize Data' })}
          </button>
          <p className="text-white/50 text-xs text-center mt-2">
            {t('profilePage.sync_desc', { defaultValue: 'Refresh your progress and XP data' })}
          </p>
        </div>
      )}

      {/* Logout Button */}
      <div className="mt-4">
        <button 
            onClick={handleLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
            <Lock size={16} /> {t('profilePage.logout')}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
