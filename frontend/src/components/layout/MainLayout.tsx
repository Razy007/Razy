import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  ShoppingBag, 
  User as UserIcon,
  Activity,
  MessageCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { label: t('nav.home', 'Accueil'), path: '/', icon: <Home size={20} /> },
    { label: t('nav.courses', 'Cours'), path: '/courses', icon: <BookOpen size={20} /> },
    { label: t('nav.shop', 'Boutique'), path: '/shop', icon: <ShoppingBag size={20} /> },
    { label: t('nav.social', 'Social'), path: '/social', icon: <MessageCircle size={20} /> },
    { label: t('nav.leaderboard', 'Top'), path: '/leaderboard', icon: <Trophy size={20} /> },
    { label: t('nav.skills', 'Analyse'), path: '/skills', icon: <Activity size={20} /> },
    { label: t('nav.profile', 'Profil'), path: '/profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation (Responsive: Hidden on Desktop) */}
      {/* Mobile Bottom Navigation (Native App Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-t border-white/10 z-[100] pb-safe-area-bottom">
        <div className="grid grid-cols-7 items-end h-16 pb-2 px-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-full h-full ${
                location.pathname === item.path
                  ? 'text-yellow-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`transition-all duration-300 ${
                location.pathname === item.path ? '-translate-y-0.5' : ''
              }`}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 18 })}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-tight truncate w-full text-center ${
                location.pathname === item.path ? 'opacity-100' : 'opacity-60'
              }`}>
                {item.label}
              </span>
              {location.pathname === item.path && (
                <div className="absolute top-0 w-6 h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] rounded-full" />
              )}
            </Link>
          ))}
        </div>

      </nav>
    </div>
  );
};
