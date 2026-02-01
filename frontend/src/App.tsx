import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import { ApiService } from './services/ApiService';
import { AdManager } from './services/AdManager';

// Layouts
import { MainLayout } from './components/layout/MainLayout';

// Screens / Pages
import { LoginScreen } from './screens/LoginScreen';
import { HomePage } from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import ShopPage from './pages/ShopPage';
import StakingPage from './pages/StakingPage';
import SocialPage from './pages/SocialPage';
import SkillsAnalysisPage from './pages/SkillsAnalysisPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import UserProfilePage from './pages/UserProfilePage';
import { WalletSetupPage } from './pages/WalletSetupPage';

// Standard Loading Component - Premium Dark Version
const PageLoader = () => (
  <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center relative overflow-hidden">
    {/* Background Decorative Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px]"></div>
    
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-yellow-500/20"></div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-yellow-400 font-black uppercase tracking-[0.3em] text-sm animate-pulse">Pioneer Academy</h2>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Chargement des données...</p>
      </div>
    </div>
  </div>
);

// Capture referral code from URL on app load
const captureReferralCode = () => {
  const params = new URLSearchParams(window.location.search);
  const refCode = params.get('ref');
  if (refCode) {
    localStorage.setItem('pending_referral_code', refCode);
    console.log('[Referral] Code captured from URL:', refCode);
    // Optionally clean URL
    const newUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }
};

// Execute once on module load
captureReferralCode();

const AppRouter: React.FC = () => {
  const { isAuthenticated, user, refreshProfile, updateUserAvatar } = useAuth();

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Limit size to 500KB to avoid DB bloat
    if (file.size > 500 * 1024) {
      toast.error("Image too large. Max 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      
      if (user?.uid.startsWith('guest_')) {
        // GUEST MODE: Local Update Only
        const loadingToast = toast.loading("Sauvegarde locale de l'avatar...");
        try {
          const stored = localStorage.getItem('pi_user');
          if (stored) {
             const parsed = JSON.parse(stored);
             parsed.avatar = base64;
             localStorage.setItem('pi_user', JSON.stringify(parsed));
             
             // Give time for toast
             setTimeout(() => {
                toast.dismiss(loadingToast);
                toast.success("Avatar invité mis à jour !");
                window.location.reload(); // Force update to reflect changes everywhere
             }, 800);
          }
        } catch (e) {
          toast.error("Erreur de sauvegarde locale");
        }
        return;
      } 
      
      try {
        const loadingToast = toast.loading("Mise à jour...");
        await ApiService.updateAvatar(base64);
        await refreshProfile();
        toast.dismiss(loadingToast);
        toast.success("Avatar mis à jour !");
      } catch (err) {
        console.error('Avatar upload failed, falling back to local:', err);
        // Fallback to local update
        updateUserAvatar(base64); 
        toast.dismiss();
        toast.success("Avatar mis à jour (Sauvegarde Locale)");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Routes>
      {/* Public Routes - Accessible always */}
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />

      {/* Auth-guarded Routes */}
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          
          {/* Note: Other pages need props or internal useAuth. 
              Refactoring them implicitly by passing what they currently expect. 
              A full refactor of each page component would be even better. */}
          <Route path="/leaderboard" element={
            <LeaderboardPage />
          } />
          
          <Route path="/social" element={<SocialPage />} />
          <Route path="/skills" element={<SkillsAnalysisPage />} />
          
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/staking" element={<StakingPage />} />
          <Route path="/wallet-setup" element={<WalletSetupPage />} />
          
          <Route path="/profile" element={
            user ? (
              <ProfilePage 
                user={{
                  uid: user.uid,
                  username: user.username,
                  avatar: user.avatar || ''
                }}
                userProgress={user.userProgress || { 
                  level: 1, 
                  xp: 0, 
                  cumulatedXP: 0, 
                  piBalance: 0, 
                  referralCode: 'N/A',
                  economy: {
                      balance: 0,
                      transferableBalance: 0,
                      lifetimeEarnings: 0,
                      lifetimeSpent: 0,
                      credibilityScore: 0,
                      withdrawalTier: 0,
                      pendingWithdrawals: 0
                  },
                  inventory: [] 
                }}
                profilePicture={user.avatar || null}
                handleProfilePictureUpload={handleProfilePictureUpload} 
                removeProfilePicture={() => {}}
                copyToClipboard={(text: string) => {
                  navigator.clipboard.writeText(text);
                  toast.success('Copié !');
                }}
              />
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/user/:userId" element={<UserProfilePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
};

const App: React.FC = () => {
  // Initialize AdManager on app load
  useEffect(() => {
    AdManager.init();
  }, []);

  return (
    <AuthProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <AppRouter />
      </Suspense>
    </AuthProvider>
  );
};

export default App;
