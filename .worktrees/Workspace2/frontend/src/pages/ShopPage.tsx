import React, { useState } from 'react';
import { Gift, Award, Zap, Crown, ShieldCheck, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../components/BaseComponents';
import { useAuth } from '../context/AuthContext';
import { ACADEMY_SHOP_ITEMS, ShopItem } from '../data/shopContent';
import { EconomyEngine } from '../services/EconomyEngine';
import { toast } from 'react-hot-toast';
import { ApiService } from '../services/ApiService';

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUserProgress } = useAuth();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  
  // Safe Access to User Progress & Economy
  const userProgress = (user as any)?.userProgress;
  // Fallback for balance display (legacy vs economy)
  const displayBalance = userProgress?.economy?.balance ?? userProgress?.piBalance ?? 0.00;
  
  const handlePurchase = async (item: ShopItem) => {
      if (!userProgress) return;
      
      setPurchasing(item.id);

      // --- LOGIQUE DE SÉGRÉGATION (ANTI-FARM) ---
      if (item.category === 'license') {
          // Achat de Licence = Paiement Réel via SDK
          try {
              if (!(window as any).Pi) {
                  throw new Error('Pi Network SDK not ready');
              }

              // Create Payment
              await (window as any).Pi.createPayment({
                amount: item.cost,
                memo: `Academy License: ${item.name.en}`,
                metadata: { type: 'license', itemId: item.id }
              }, {
                onReadyForServerApproval: async (paymentId: string) => {
                    await ApiService.approvePayment(paymentId);
                },
                onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                    await ApiService.completePayment(paymentId, txid);
                    toast.success(t('shop.purchase_success', { productName: item.name.fr, extra: " + Cashback 10%!" }));
                    
                    // Force refresh profile to see new withdrawal status
                    setTimeout(() => window.location.reload(), 1500);
                },
                onCancel: (_paymentId: string) => { 
                    setPurchasing(null);
                    toast.error("Paiement annulé");
                },
                onError: (error: Error, _payment: any) => {
                    setPurchasing(null);
                    console.error(error);
                    toast.error(`Erreur: ${error.message}`);
                }
              });

          } catch (error: any) {
             setPurchasing(null);
             toast.error(error.message || 'Erreur SDK');
          }
          return;
      }
      
      // --- LOGIQUE INTERNE (Consommables) ---
      // Simulate network delay for better UX feeling
      await new Promise(r => setTimeout(r, 800));

      const result = EconomyEngine.purchaseItem(userProgress, item.id);
      
      if (result.success && result.updatedUser) {
          toast.success(result.message);
          // Update global state
          updateUserProgress(result.updatedUser);
      } else {
          toast.error(result.message);
      }
      
      setPurchasing(null);
  };

  const handlePurchaseRealPi = async (item: ShopItem) => {
      setPurchasing(item.id);
      try {
          if (!(window as any).Pi) {
              throw new Error('Pi Network SDK not ready');
          }

          // Create Payment (Real Pi)
          await (window as any).Pi.createPayment({
            amount: item.cost, // Use same cost or adjusted? Assuming 1:1 for simplicity/GCV
            memo: `Academy Shop: ${item.name.en}`,
            metadata: { type: 'shop_item', itemId: item.id }
          }, {
            onReadyForServerApproval: async (paymentId: string) => {
                await ApiService.approvePayment(paymentId);
            },
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                await ApiService.completePayment(paymentId, txid);
                toast.success(t('shop.purchase_success', { productName: item.name.fr, extra: " (Mainnet)" }));
                // Force refresh
                updateUserProgress({ ...userProgress, energyBalance: (userProgress.energyBalance || 0) + (item.effect.type === 'energy_refill' ? item.effect.value : 0) });
                setPurchasing(null);
            },
            onCancel: (_paymentId: string) => { 
                setPurchasing(null);
                toast.error("Paiement annulé");
            },
            onError: (error: Error, _payment: any) => {
                setPurchasing(null);
                console.error(error);
                toast.error(`Erreur: ${error.message}`);
            }
          });
      } catch (error: any) {
         setPurchasing(null);
         toast.error(error.message || 'Erreur SDK');
      }
  };

  const getIcon = (category: string) => {
      switch(category) {
          case 'consumable': return <Zap className="text-yellow-400" />;
          case 'boost': return <ShieldCheck className="text-blue-500" />;
          case 'license': return <Crown className="text-purple-500" />;
          default: return <Award className="text-orange-500" />;
      }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-6 bg-yellow-500/10 rounded-[2.5rem] border border-yellow-500/20 shadow-2xl shadow-yellow-500/5 mb-2 relative group overflow-hidden">
          <Gift size={56} className="text-yellow-500 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {t('shop.title_main', 'Boutique')} <span className="text-yellow-500">{t('shop.title_highlight', 'Academy')}</span>
        </h2>
        <p className="text-white/40 font-bold max-w-xl mx-auto uppercase tracking-widest text-[10px]">
          {t('shop.subtitle', 'Investissez dans votre succès. Débloquez les retraits via le Proof of Spend.')}
        </p>
      </div>

      {/* Logic Card: Effort -> Reward */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-10 bg-white/5 border-white/5 backdrop-blur-3xl rounded-[2.5rem]">
                <h4 className="text-yellow-500 font-black uppercase text-xs tracking-widest mb-4">{t('shop.circular_economy', 'Économie Circulaire')}</h4>
                <p className="text-white font-black text-xl mb-4 leading-tight italic">&quot;{t('shop.quote', 'Dépensez pour retirer.')}&quot;</p>
                <p className="text-white/40 text-sm leading-relaxed">
                    {t('shop.educ_pi_desc', 'Les Pi gagnés ici sont "Éducatifs". Pour les rendre "Réels" et transférables, vous devez prouver votre engagement en investissant dans l\'écosystème (Licences, Outils).')}
                </p>
            </Card>
            <Card className="p-10 bg-yellow-500/10 border-yellow-500/20 rounded-[2.5rem] flex flex-col justify-center">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-yellow-500/60 uppercase tracking-widest">{t('shop.educ_balance', 'Votre Solde Éducatif')}</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-[8px] font-black rounded-lg">{t('shop.internal_tag', 'INTERNE')}</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black text-white tracking-tighter">{displayBalance.toFixed(2)}</span>
                        <span className="text-xl font-black text-yellow-500">π</span>
                    </div>
                </div>
            </Card>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ACADEMY_SHOP_ITEMS.map((item) => (
          <Card key={item.id} className="group transition-all p-8 flex flex-col h-full bg-white/5 backdrop-blur-3xl border-white/10 shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2 hover:border-white/20 rounded-[2.5rem] relative pt-12">
            
            {/* CATEGORY BADGE */}
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1 text-black text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg ${item.category === 'license' ? 'bg-purple-500 text-white' : 'bg-yellow-500'}`}>
                {item.category === 'license' ? t('shop.license_official', 'LICENCE OFFICIELLE') : t(`shop.item.${item.category}`, item.category)}
            </div>

            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors border border-white/5 relative overflow-hidden shadow-inner mx-auto">
               {React.cloneElement(getIcon(item.category) as React.ReactElement, { size: 36, className: 'relative z-10' })}
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
            </div>
            
            <div className="space-y-3 mb-8 flex-grow text-center">
               <h3 className="text-xl font-black text-white tracking-tight group-hover:text-yellow-400 transition-colors">
                 {i18n.language.startsWith('fr') ? item.name.fr : item.name.en}
               </h3>
               <p className="text-white/40 text-[10px] font-bold leading-relaxed uppercase tracking-[0.1em] px-4">
                 {i18n.language.startsWith('fr') ? item.description.fr : item.description.en}
               </p>
               
               {/* CREDIBILITY SCORE REWARD */}
               <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 border border-green-500/30 rounded-lg">
                    <span className="text-[9px] text-green-400 font-bold uppercase">{t('shop.credibility_reward', { score: item.credibilityScore })}</span>
               </div>
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6">
               <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t('shop.cost')}</span>
                  <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-black text-white tracking-tighter">{item.cost}</span>
                     <span className="text-xs font-black text-yellow-500 opacity-60">π</span>
                  </div>
               </div>
               
               <Button 
                    variant={item.category === 'license' ? "premium" : "primary"} 
                    className="w-full py-4 text-[10px] shadow-yellow-500/10"
                    onClick={() => handlePurchase(item)}
                    disabled={!!purchasing || displayBalance < item.cost}
                >
                  {purchasing === item.id ? (
                      <span className="animate-pulse">{t('common.loading', 'Traitement...')}</span>
                  ) : displayBalance < item.cost ? (
                      <span className="opacity-50">{t('shop.insufficient_balance_btn', 'Solde Insuffisant')}</span>
                  ) : (
                      t('shop.acquire', 'Acquérir')
                  )}
               </Button>

                {/* Option Paiement Direct Mainnet */}
                {item.category !== 'license' && (
                    <button 
                        onClick={() => handlePurchaseRealPi(item)}
                        disabled={!!purchasing}
                        className="w-full mt-3 text-[9px] font-bold text-yellow-500/40 hover:text-yellow-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-1 group/real"
                    >
                        <span>{t('shop.pay_mainnet', 'Ou payer en Pi Mainnet')}</span>
                        <span className="opacity-0 group-hover/real:opacity-100 transition-opacity">⚡</span>
                    </button>
                )}
            </div>
          </Card>
        ))}
      </div>

      {/* Special Offer (Static for visual impact, or mapped to bundle later) */}
      <Card className="bg-white/5 backdrop-blur-3xl border-white/10 overflow-hidden relative rounded-[3rem] shadow-3xl opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
         <div className="relative z-20 flex flex-col lg:flex-row items-center gap-16 p-10 lg:p-20">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
               <div className="inline-block px-5 py-2 bg-gray-700 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl">
                 {t('shop.coming_soon')}
               </div>
               <h3 className="text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter" dangerouslySetInnerHTML={{ __html: t('shop.elite_pack').replace(' ', '<br/><span class="text-yellow-400">') + '</span>' }}></h3>
               <p className="text-white/40 text-lg font-medium leading-relaxed max-w-lg">
                  {t('shop.elite_desc')}
               </p>
            </div>
            <div className="lg:w-1/2 relative flex justify-center">
                 <Lock size={100} className="text-white/20" />
            </div>
         </div>
      </Card>

      {/* Legal & Info */}
      <div className="text-center py-10 opacity-20">
         <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t('shop.legal')}</p>
      </div>
    </div>
  );
};

export default ShopPage;
