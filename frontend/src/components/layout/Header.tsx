import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  ShoppingBag, 
  User as UserIcon, 
  Globe, 
  Bell,
  Users,
  Lock,
  BarChart3
} from 'lucide-react';
import { InternalWallet } from '../user/InternalWallet';
import { NotificationPanel } from '../notifications/NotificationPanel';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const navItems = [
    { label: t('nav.home', 'Accueil'), path: '/', icon: <Home size={18} /> },
    { label: t('nav.courses', 'Cours'), path: '/courses', icon: <BookOpen size={18} /> },
    { label: t('nav.skills', 'Analyse'), path: '/skills', icon: <BarChart3 size={18} /> },
    { label: t('nav.leaderboard', 'Classement'), path: '/leaderboard', icon: <Trophy size={18} /> },
    { label: t('nav.social', 'Social'), path: '/social', icon: <Users size={18} /> },
    { label: t('nav.shop', 'Boutique'), path: '/shop', icon: <ShoppingBag size={18} /> },
    { label: t('nav.profile_tab', 'Profil'), path: '/profile', icon: <UserIcon size={18} /> },
  ];

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('academy_of_pi_language', lang);
    setShowLanguageMenu(false);
  };

  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count on mount
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      try {
        const res = await import('../../services/ApiService').then(m => m.ApiService.getNotifications());
        if (res.data.success) {
          const unread = res.data.notifications.filter((n: { isRead: boolean }) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Failed to fetch unread count', err);
      }
    };
    fetchUnreadCount();
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo & Name */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">π</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white leading-none">Academy</h1>
              <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mt-0.5">of Pi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === item.path
                    ? 'bg-white/10 text-yellow-400 shadow-sm'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Language Toggle */}
             <div className="relative">
                <button 
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400"
                >
                  <Globe size={20} />
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <button onClick={() => toggleLanguage('fr')} className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2 font-medium text-white">
                      <span>🇫🇷</span> Français
                    </button>
                    <button onClick={() => toggleLanguage('en')} className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2 font-medium text-white">
                      <span>🇬🇧</span> English
                    </button>
                  </div>
                )}
             </div>

             {/* Notifications */}
             <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 relative"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#0f172a] rounded-full animate-pulse"></span>
                    )}
                </button>
                <NotificationPanel 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                  onUnreadCountChange={setUnreadCount}
                />
             </div>

             {/* Profile / Balance (Desktop only mostly) */}
             <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <button 
                  onClick={() => setShowWallet(true)}
                  className="text-right hover:bg-white/5 p-2 rounded-xl transition-all group"
                >
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1 group-hover:text-yellow-500 transition-colors">PORTFOLIO</p>
                  <p className="text-sm font-black text-yellow-500 leading-none">{(user?.userProgress?.economy?.balance || 0).toFixed(6)} π</p>
                </button>
                <Link to="/profile" className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-colors flex items-center justify-center">
                  {user?.avatar && user.avatar !== '👤' && user.avatar !== '🕵️' ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{user?.avatar || '👤'}</span>
                  )}
                </Link>
             </div>

             {/* Internal Wallet Modal */}
             {showWallet && (
               <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowWallet(false)} />
                 <div className="relative z-[100000] max-w-md w-full animate-in zoom-in-95 duration-200">
                    <InternalWallet 
                       piBalance={user?.userProgress?.economy?.balance || 0} 
                       xp={user?.userProgress?.xp || 0}
                       level={user?.userProgress?.level || 1}
                       onClose={() => setShowWallet(false)} 
                       transferableBalance={user?.userProgress?.economy?.transferableBalance || 0}
                    />
                 </div>
               </div>
             )}

             {/* Logout (Small devices) */}
             <button 
                onClick={logout} 
                className="sm:hidden p-2 hover:bg-red-500/10 rounded-full transition-colors text-red-400 border border-red-500/20"
                title="Logout"
             >
                <Lock size={20} />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};
