import React, { useState } from 'react';
import { Shield, User, Globe, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onGuest: () => void;
  loading: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuest, loading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20 animate-bounce-slow">
            <span className="text-4xl">π</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Pioneer Academy
          </h1>
          <p className="text-purple-200 text-sm mt-2 text-center">
            Learn • Earn • Grow
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin text-xl">↻</span>
            ) : (
              <Shield size={24} className="text-black" />
            )}
            {loading ? 'Connexion...' : 'Connect with Pi Key'}
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OU</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            onClick={onGuest}
            disabled={loading}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 group"
          >
            <User size={20} className="text-purple-300 group-hover:text-white transition" />
            Mode Invité (Limité)
          </button>
        </div>

        {/* Info / Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-2">
            <Lock size={12} />
            <span>Secure Pi Network Auth</span>
          </div>
          <p className="text-[10px] text-gray-500">
            En vous connectant, vous acceptez nos <a href="#" className="underline hover:text-gray-300">Conditions</a> et notre <a href="#" className="underline hover:text-gray-300">Politique de Confidentialité</a>.
            <br/>L'accès aux fonctionnalités financières (Staking, Shop) nécessite un KYC validé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
