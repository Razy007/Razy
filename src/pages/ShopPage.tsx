
import React from 'react';
import { Gift, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserProgress } from '../types';

interface ShopPageProps {
  userProgress: any; // Using any to match App.tsx likely usage, though types.UserProgress is better
  setUserProgress: React.Dispatch<React.SetStateAction<any>>;
  piGcv: number;
  kycStatus: string;
}

const ShopPage: React.FC<ShopPageProps> = ({ userProgress, setUserProgress, piGcv, kycStatus }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Gift size={48} className="text-yellow-400 mx-auto mb-3" />
        <h3 className="text-white text-3xl font-bold mb-2">🎁 {t('nav.shop')}</h3>
        <p className="text-purple-300">{t('shop.subtitle')}</p>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-black mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">{t('shop.your_balance')}</p>
            <p className="text-3xl font-bold">{userProgress.piBalance.toFixed(6)}π</p>
            <p className="text-sm opacity-80">≈ ${(userProgress.piBalance * piGcv).toFixed(2)} USD</p>
          </div>
          <Award size={48} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { name: t('shop.items.avatar_premium'), cost: 0.001, icon: '👑', description: t('shop.items.avatar_desc') },
          { name: t('shop.items.badge_legendary'), cost: 0.002, icon: '⭐', description: t('shop.items.badge_desc') },
          { name: t('shop.items.boost_xp'), cost: 0.003, icon: '⚡', description: t('shop.items.boost_desc') },
          { name: t('shop.items.pass_premium'), cost: 0.005, icon: '💎', description: t('shop.items.pass_desc') }
        ].map((item, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all hover:scale-105">
            <div className="text-center mb-3">
              <div className="text-5xl mb-2">{item.icon}</div>
              <p className="text-white font-bold mb-1">{item.name}</p>
              <p className="text-purple-300 text-xs">{item.description}</p>
            </div>
            <div className="text-center mb-3">
              <p className="text-yellow-400 font-bold text-lg">{item.cost}π</p>
              <p className="text-green-400 text-xs">~${(item.cost * piGcv).toFixed(2)} USD</p>
            </div>
            <button
              onClick={() => {
                if (kycStatus !== 'verified') {
                  alert(t('alerts.shop_kyc_required'));
                  return;
                }
                if (userProgress.piBalance >= item.cost) {
                  setUserProgress((prev: any) => ({ ...prev, piBalance: prev.piBalance - item.cost }));
                  alert(t('alerts.item_purchased', { item: item.name }));
                } else {
                  alert(t('alerts.insufficient_balance'));
                }
              }}
              className={`w-full font-bold py-2 rounded-lg transition ${userProgress.piBalance >= item.cost
                ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
            >
              {userProgress.piBalance >= item.cost ? t('shop.buy') : t('shop.insufficient')}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mt-6">
        <h4 className="text-white font-bold text-xl mb-4">🎯 {t('shop.special_packs')}</h4>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-white font-bold text-lg">🚀 {t('shop.items.pack_starter')}</p>
              <p className="text-purple-300 text-sm">{t('shop.items.pack_desc')}</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold">0.008π</p>
              <p className="text-green-400 text-xs line-through opacity-50">0.012π</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (userProgress.piBalance >= 0.008) {
                setUserProgress((prev: any) => ({ ...prev, piBalance: prev.piBalance - 0.008 }));
                alert(t('alerts.pack_purchased'));
              } else {
                alert(t('alerts.insufficient_balance'));
              }
            }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-2 px-4 rounded-lg w-full hover:scale-105 transition"
          >
            -33%
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
