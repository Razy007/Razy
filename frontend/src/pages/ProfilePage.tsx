import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Copy, LogOut, Camera, RefreshCcw, Zap, Users } from 'lucide-react';
import { InternalWallet } from '../components/user/InternalWallet';
import ReferralDashboard from '../components/referral/ReferralDashboard';
import { FinancialStatus } from '../components/economy/FinancialStatus';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../components/BaseComponents';
import { useAuth } from '../context/AuthContext';

import { PiUserProgress } from '../types';

interface ProfilePageProps {
  user: { uid: string; username: string; avatar: string };
  userProgress: PiUserProgress;
  profilePicture: string | null;
  handleProfilePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeProfilePicture: () => void;
  copyToClipboard: (text: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  userProgress,
  profilePicture,
  handleProfilePictureUpload,
  removeProfilePicture,
  copyToClipboard
}) => {
  const { t } = useTranslation();
  const { logout, refreshProfile, user: authUser } = useAuth();
  const [showWallet, setShowWallet] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      
      {/* Profile Header Card */}
      <Card className="p-10 md:p-14 overflow-hidden relative border-white/5 shadow-3xl bg-white/5 backdrop-blur-3xl rounded-[3rem]">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           {/* Avatar Area */}
           <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-1 shadow-2xl shadow-yellow-500/20 transition-all duration-700 group-hover:scale-105 group-hover:rotate-3">
                <div className="w-full h-full bg-[#0f172a] rounded-[2.2rem] flex items-center justify-center overflow-hidden border border-white/10 relative">
                   {profilePicture ? (
                     <img src={profilePicture} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   ) : (
                     <span className="text-7xl drop-shadow-2xl">{user?.avatar || '👤'}</span>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              
              <label className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-4 rounded-2xl cursor-pointer hover:bg-yellow-400 transition-all shadow-2xl border-4 border-[#0f172a] active:scale-95 group-hover:scale-110 duration-500">
                <Camera size={22} strokeWidth={3} />
                <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
              </label>

              {profilePicture && (
                <button 
                  onClick={removeProfilePicture}
                  className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl border border-red-500/20 backdrop-blur-md"
                >
                  <Trash2 size={18} />
                </button>
              )}
           </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-6">
               <div>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-4">{user?.username}</h2>
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                     {user?.uid?.startsWith('guest_') ? (
                        <div className="px-4 py-1.5 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/10 shadow-inner">
                            {t('auth.guest_mode_label', 'Mode Invité (Limité)')}
                        </div>
                    ) : (
                        <div className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-green-500/10 shadow-inner">
                            {t('auth.pioneer_verified', 'Pioneer KYC Vérifié')}
                        </div>
                    )}
                    <div className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-yellow-500/10 shadow-inner">
                      {t('common.level', 'Niveau')} {userProgress.level}
                    </div>
                 </div>
               </div>

               {user?.uid?.startsWith('guest_') && (
                 <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl space-y-4">
                     <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{t('profilePage.upgrade_title', 'Passez au niveau supérieur')}</p>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">{t('profilePage.upgrade_desc', 'Le mode invité ne permet pas de sauvegarder votre progression on-chain ni de participer au Staking.')}</p>
                    <Button onClick={() => logout()} variant="primary" className="py-3 px-6 text-[10px]">
                        {t('auth.connect_pi', 'Connecter mon compte Pi')}
                    </Button>
                 </div>
               )}

               <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/5 px-5 py-3 rounded-2xl group cursor-help transition-all hover:bg-white/[0.05]">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Pioneer ID:</span>
                  <code className="text-xs font-black text-white/50 tracking-widest">{user?.uid}</code>
                  <button onClick={() => copyToClipboard(user?.uid)} className="text-white/20 hover:text-yellow-500 transition-all active:scale-75">
                     <Copy size={16} />
                  </button>
               </div>
            </div>

           {/* Logout Button (Desktop) */}
            <div className="hidden md:block">
               <Button onClick={() => logout()} variant="secondary" className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white shadow-none px-8">
                  <LogOut size={20} className="mr-3" />
                  {t('profilePage.logout', 'Déconnexion')}
               </Button>
            </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />
      </Card>

      {/* Stats and Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Earnings & Rewards */}
         {/* Earnings & Rewards (New Economy System) */}
         <Card className="p-0 overflow-hidden border-none bg-transparent shadow-none">
            {userProgress.economy ? (
                <div className="space-y-4">
                     <FinancialStatus userProgress={userProgress} />
                     <Button onClick={() => setShowWallet(true)} variant="premium" className="w-full py-5 shadow-xl shadow-yellow-500/10">
                        {t('profilePage.manage_wallet', 'Gérer mon Portefeuille')}
                     </Button>
                </div>
            ) : (
                /* Legacy View / Fallback Migration */
                <div className="bg-gray-800 p-6 rounded-2xl border border-red-500/30 text-center">
                    <p className="text-red-400 mb-4">Système Économique v2 en cours de déploiement...</p>
                    <div className="text-2xl font-bold text-white mb-4">{(userProgress.piBalance || 0).toFixed(7)} π</div>
                    <Button onClick={() => setShowWallet(true)} variant="premium" className="w-full">
                       {t('profilePage.legacy_wallet', 'Accéder au Wallet (Legacy)')}
                    </Button>
                </div>
            )}
         </Card>

         {/* Referral Card */}
         <Card className="p-0 overflow-hidden border-none bg-transparent shadow-none">
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-8 rounded-[2.5rem] border border-purple-500/20 backdrop-blur-xl h-full flex flex-col justify-between relative group hover:bg-purple-900/50 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-colors"></div>
                
                <div>
                   <h3 className="text-white font-black text-xl mb-3 flex items-center gap-3">
                       <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                          <Users size={24} />
                       </div>
                       {t('referral.title', 'Ambassadeur')}
                   </h3>
                   <p className="text-purple-200/60 text-sm font-medium leading-relaxed">
                       {user?.uid?.startsWith('guest_') 
                         ? t('referral.guest_teaser', 'Connectez-vous avec Pi Network pour accéder au programme de parrainage et gagner des récompenses.')
                         : t('referral.teaser', 'Invitez des amis et gagnez 10% de leurs revenus Pi et XP à vie. Construisez votre cercle de sécurité !')
                       }
                   </p>
                </div>
                
                {user?.uid?.startsWith('guest_') ? (
                    <Button 
                        onClick={() => toast.error(t('auth.connect_pi', 'Connectez-vous avec Pi Network pour accéder à cette fonctionnalité.'))}
                        variant="secondary" 
                        className="mt-6 w-full py-4 border-purple-500/30 text-purple-300/50 cursor-not-allowed opacity-60"
                    >
                       🔒 {t('auth.login_pi', 'Connexion avec Pi Network')}
                    </Button>
                ) : (
                    <Button onClick={() => setShowReferral(true)} variant="secondary" className="mt-6 w-full py-4 border-purple-500/30 text-purple-300 hover:bg-purple-500 hover:text-white shadow-lg shadow-purple-900/20">
                       {t('referral.open_dashboard', 'Ouvrir mon Dashboard')}
                    </Button>
                )}
            </div>
         </Card>

         {/* XP & Progress */}
         <Card className="p-10 border-purple-500/20 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 shadow-inner">
                   <Zap size={28} />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs mb-1">{t('profilePage.progress', 'Progression')}</h3>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{t('profilePage.mastery', 'Mastery Level')}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-3xl font-black text-purple-400 leading-none">{userProgress.cumulatedXP || 0} <span className="text-sm opacity-30">XP</span></p>
              </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    <span>{t('stats.rank', 'Rank')} {userProgress.level || 1}</span>
                    <span>{t('stats.rank', 'Rank')} {(userProgress.level || 1) + 1}</span>
                 </div>
                 <div className="w-full bg-white/5 h-4 rounded-2xl overflow-hidden border border-white/5 p-1 relative shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-600 h-full rounded-xl transition-all duration-1000 shadow-lg shadow-indigo-500/20"
                      style={{ width: `${(userProgress.xp || 0)}%` }}
                    />
                 </div>
               </div>
               <Button 
                onClick={async () => {
                    const tLoad = toast.loading(t('common.loading', 'Synchronisation...'));
                    try {
                        await refreshProfile();
                        toast.success(t('profilePage.sync_success', 'Données synchronisées !'), { id: tLoad });
                    } catch (e) {
                        toast.error(t('profilePage.sync_error', 'Erreur de synchronisation'), { id: tLoad });
                    }
                }}
                variant="secondary" className="w-full py-5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
               >
                  <RefreshCcw size={18} className="mr-3 opacity-40 group-hover:rotate-180 transition-transform duration-700" />
                  {t('profilePage.sync', 'Synchroniser Données')}
               </Button>
            </div>
         </Card>
      </div>

      {/* Logout Mobile Only */}
      <div className="md:hidden pt-4">
         <Button onClick={() => logout()} variant="secondary" className="w-full py-6 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
            <LogOut size={20} className="mr-3" />
            {t('profilePage.logout', 'Se Déconnecter')}
         </Button>
      </div>
      
      {/* Footer Info */}
      <div className="text-center py-10 space-y-6 opacity-30">
         <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Academy of Pi Environment &bull; Beta Access 2.0</p>
         <div className="flex justify-center gap-10">
            <Link to="/privacy" className="text-[10px] font-black text-white hover:text-yellow-500 transition-colors uppercase tracking-[0.2em]">Confidentialité</Link>
            <Link to="/terms" className="text-[10px] font-black text-white hover:text-yellow-500 transition-colors uppercase tracking-[0.2em]">Conditions</Link>
         </div>
      </div>

      {/* Internal Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowWallet(false)} />
          <div className="relative z-10 max-w-md w-full animate-in zoom-in-95 duration-200">
            <InternalWallet 
              piBalance={userProgress.piBalance || 0} 
              transferableBalance={userProgress.economy?.transferableBalance || 0}
              xp={userProgress.xp || 0}
              level={userProgress.level || 1}
              onClose={() => setShowWallet(false)} 
            />
          </div>
        </div>
      )}

      {/* Referral Dashboard Modal */}
      {showReferral && (
          <ReferralDashboard 
              userToken={authUser?.accessToken || 'MOCK'}
              onClose={() => setShowReferral(false)}
          />
      )}
    </div>
  );
};

export default ProfilePage;
