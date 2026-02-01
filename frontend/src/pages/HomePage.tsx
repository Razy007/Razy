import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Card, Button as BaseButton, StatusBadge } from '../components/BaseComponents';
import { ApiService } from '../services/ApiService';
import { PiSDKService } from '../services/PiSDKService';
import { formatPiToUSD } from '../utils/format';
import { toast } from 'react-hot-toast';

const EnergyTimer: React.FC<{ lastUpdate?: number, currentEnergy: number }> = ({ lastUpdate, currentEnergy }) => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState("");
    
    useEffect(() => {
        if (currentEnergy >= 100) {
            setTimeLeft("");
            return;
        }
        
        const updateTimer = () => {
            const now = Date.now();
            // recovery is 5 minutes (300000ms)
            const elapsed = now - (lastUpdate || now);
            const remaining = 300000 - (elapsed % 300000);
            
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [lastUpdate, currentEnergy]);

    if (currentEnergy >= 100 || !timeLeft) return null;

    return (
        <div className="mt-3 text-[9px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20 animate-pulse">
            {t('home.next_plus_one', { time: timeLeft })}
        </div>
    );
};

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const [loadingError, setLoadingError] = useState(false);
  const profile = user?.userProgress;

  useEffect(() => {
    const loadData = async () => {
      if (user && !user.uid.startsWith('guest_')) {
        try {
          await refreshProfile();
          setLoadingError(false);
        } catch (err) {
          console.error('[HomePage] Profile load error:', err);
          setLoadingError(true);
        }
      }
    };
    loadData();
  }, [user, refreshProfile]);

  // Handler for recharging energy
  const handleRecharge = () => {
    // Scroll to deposit card or open a modal
    const depositCard = document.getElementById('deposit-card');
    if (depositCard) {
        depositCard.scrollIntoView({ behavior: 'smooth' });
        toast('Utilisez le dépôt direct pour recharger votre énergie', { icon: '⚡' });
    }
  };

  if (!profile) return (
    <div className="flex flex-col items-center justify-center p-20 gap-6 text-center">
      {!loadingError ? (
        <>
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Chargement des données...</p>
        </>
      ) : (
        <>
          <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 mb-2">
            <Activity className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-white/60 font-medium">Impossible de charger votre profil</p>
          <p className="text-white/20 text-[10px] uppercase tracking-widest max-w-xs">Veuillez vérifier votre connexion à Pioneer Academy</p>
          <BaseButton variant="secondary" onClick={() => window.location.reload()} className="mt-4">
            Actualiser la page
          </BaseButton>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      
      {/* Background Decorative Blobs specific to this page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Balance & Progress Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-gradient-to-br from-yellow-500 to-yellow-600 text-black border-0 relative overflow-hidden shadow-2xl shadow-yellow-500/20 rounded-[2.5rem] p-10">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center border border-white/30 shadow-2xl relative overflow-hidden group">
                  {user?.avatar && user.avatar !== '👤' && user.avatar !== '🕵️' ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                      <span className="text-4xl">{user?.avatar || '👤'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tight leading-none mb-3">{t('common.greeting', 'Bonjour')}, {user?.username}</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 bg-black/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-black/5">
                      {t('common.level', 'Niveau')} {profile?.level || user?.userProgress?.level || 1}
                    </span>
                    <span className="text-black/60 text-xs font-bold">{profile?.cumulatedXP || user?.userProgress?.cumulatedXP || 0} {t('stats.xp_total', 'XP Total')}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-60 uppercase font-black tracking-[0.2em] mb-2">{t('home.pi_portfolio', 'Portfolio Pi')}</p>
                <div className="flex items-baseline gap-2 justify-end">
                   <p className="text-5xl md:text-6xl font-black leading-none tracking-tighter">
                     {(profile?.piBalance || 0).toFixed(7)}
                   </p>
                   <span className="text-2xl font-black opacity-40">π</span>
                </div>
                <div className="flex items-center gap-2 justify-end mt-2">
                   <p className="text-[11px] font-black bg-black/10 px-3 py-1 rounded-full border border-black/5">
                      ≈ {formatPiToUSD(profile?.piBalance || 0)} USD
                   </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t('home.level_progress', 'Progression Niveau')}</span>
                <span className="text-sm font-black tracking-tight">{(profile?.cumulatedXP || 0) % 100}%</span>
              </div>
              <div className="w-full bg-black/10 h-4 rounded-2xl overflow-hidden border border-black/5 p-1 relative">
                <div 
                  className="bg-black h-full rounded-xl transition-all duration-1000 ease-out shadow-lg" 
                  style={{ width: `${(profile?.cumulatedXP || 0) % 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-black/5 rounded-full blur-[60px]"></div>
        </Card>

        <Card className="flex flex-col justify-between group overflow-hidden relative border-white/5 rounded-[2.5rem] p-10 bg-white/5 backdrop-blur-3xl shadow-2xl">
          <div className="relative z-10 flex-grow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs mb-1">{t('home.energy_title', "Système d'Énergie")}</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase">{t('home.energy_subtitle', "Consommation Quiz")}</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform duration-500 border border-purple-500/20">
                <Activity size={24} />
              </div>
            </div>
            
            <div className="relative h-40 flex items-center justify-center">
               <div className="text-center relative z-20">
                  <p className="text-6xl font-black text-white mb-2 tracking-tighter">{profile?.energyBalance || user?.userProgress?.energyBalance || 0}</p>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-blink"></div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t('home.live_status', 'Live Status')}</p>
                  </div>
                  <EnergyTimer 
                    lastUpdate={profile?.lastEnergyUpdate || user?.userProgress?.lastEnergyUpdate} 
                    currentEnergy={profile?.energyBalance || user?.userProgress?.energyBalance || 0} 
                  />
               </div>
               
               {/* Decorative Ring */}
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-36 h-36 rounded-full border-[10px] border-white/5 border-t-purple-500 animate-spin-slow"></div>
               </div>
            </div>
          </div>
          <BaseButton onClick={handleRecharge} variant="secondary" className="w-full py-5 mt-6 border-white/10 bg-white/5 hover:bg-white/10 shadow-none">
            {t('home.recharge', 'Recharger')}
          </BaseButton>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
        </Card>
      </div>

      {/* Main Tools Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <PiPaymentCard balance={profile?.piBalance || 0} onComplete={refreshProfile} />
         <StakingPanel 
            stakingBalance={profile?.stakingBalance || 0} 
            transferableBalance={profile?.economy?.transferableBalance || user?.userProgress?.economy?.transferableBalance || 0}
            onComplete={refreshProfile} 
         />
      </div>

      {/* History */}
      <div className="mt-4">
        <TransactionHistory />
      </div>
    </div>
  );
};

// Sub-components moved from Dashboard
function StakingPanel({ stakingBalance, transferableBalance, onComplete }: { stakingBalance: number; transferableBalance: number; onComplete: () => void }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [amount, setAmount] = useState(10);
    const [period, setPeriod] = useState(30);
    const [loading, setLoading] = useState(false);

    const handleStake = async () => {
        if (user?.uid?.startsWith('guest_')) {
            return toast.error("Le staking nécessite un compte KYC vérifié. (Mode Invité)");
        }
        if (amount < 1) return toast.error('Minimum 1 Pi');
        if (amount > transferableBalance) return toast.error(`Solde insuffisant (Dispo: ${transferableBalance.toFixed(2)} Pi)`);
        setLoading(true);
        try {
            await ApiService.createStake(amount, period);
            toast.success('Staking activé !');
            onComplete();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || 'Erreur Staking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-green-500 shadow-2xl overflow-hidden relative p-10 bg-white/5 backdrop-blur-3xl rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                    <div className="p-5 bg-green-500/10 rounded-2xl text-green-400 flex items-center justify-center border border-green-500/20 shadow-inner">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs mb-1">{t('staking.title', 'Staking Pro')}</h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase">{t('staking.subtitle', 'Compound Interest')}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-2">{t('staking.committed', 'Engagé')}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <p className="text-3xl font-black text-green-400 leading-none">{stakingBalance?.toFixed(2)}</p>
                      <span className="text-sm font-black text-green-400/40">π</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="text-[10px] uppercase font-black text-white/30 mb-3 block tracking-[0.2em]">{t('staking.amount', 'Montant')}</label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(Number(e.target.value))} 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-black text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all outline-none text-xl" 
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-white/10 text-xl group-focus-within:text-green-500/30 transition-colors">π</span>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-black text-white/30 mb-3 block tracking-[0.2em]">{t('staking.duration', 'Durée')}</label>
                    <div className="relative">
                      <select 
                        value={period} 
                        onChange={e => setPeriod(Number(e.target.value))} 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 font-black text-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all outline-none appearance-none cursor-pointer"
                      >
                          <option value={7} className="bg-[#1a1a1a]">7 {t('common.days', 'JOURS')} (2%)</option>
                          <option value={30} className="bg-[#1a1a1a]">30 {t('common.days', 'JOURS')} (8%)</option>
                          <option value={90} className="bg-[#1a1a1a]">90 {t('common.days', 'JOURS')} (15%)</option>
                          <option value={180} className="bg-[#1a1a1a]">180 {t('common.days', 'JOURS')} (20%)</option>
                          <option value={365} className="bg-[#1a1a1a]">1 {t('common.year', 'AN')} (25%)</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                          <Activity size={18} />
                      </div>
                    </div>
                </div>
            </div>
            <BaseButton onClick={handleStake} disabled={loading} variant="premium" className="w-full py-6">
                {loading ? t('staking.activating', 'Activation...') : t('staking.start', 'Lancer le Staking')}
            </BaseButton>
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
        </Card>
    );
}

function PiPaymentCard({ onComplete }: { balance?: number; onComplete: () => void }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [amount, setAmount] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (user?.uid?.startsWith('guest_')) {
            return toast.error("Le dépôt réel nécessite un compte KYC vérifié via le Pi Browser. (Mode Invité)");
        }
        if (amount <= 0) return toast.error('Montant invalide');
        setLoading(true);
        
        try {
            await PiSDKService.getInstance().createPayment({
                amount,
                memo: "Rechargement de compte Academy of Pi",
                metadata: { type: "deposit" }
            }, {
                onReadyForServerApproval: async (paymentId) => {
                    await ApiService.approvePayment(paymentId);
                    toast.success('Paiement approuvé');
                },
                onReadyForServerCompletion: async (paymentId, txid) => {
                    await ApiService.completePayment(paymentId, txid);
                    toast.success('Transaction terminée !');
                    setLoading(false);
                    onComplete();
                },
                onCancel: (_) => {
                    toast.error('Annulé');
                    setLoading(false);
                },
                onError: (error) => {
                    toast.error('Erreur SDK : ' + error.message);
                    setLoading(false);
                }
            });
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || 'Erreur fatale SDK');
            setLoading(false);
        }
    };

    return (
        <div id="deposit-card">
        <Card className="border-t-4 border-t-yellow-500 shadow-2xl overflow-hidden relative p-10 bg-white/5 backdrop-blur-3xl rounded-[2.5rem]">
            <div className="flex items-center gap-5 mb-10">
                <div className="p-5 bg-yellow-500/10 rounded-2xl text-yellow-500 flex items-center justify-center border border-yellow-500/20 shadow-inner">
                    <Wallet size={28} />
                </div>
                <div>
                    <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs mb-1">{t('home.deposit_title', 'Dépôt Direct')}</h3>
                    <p className="text-[10px] text-white/30 font-bold uppercase">{t('home.deposit_subtitle', 'Pi SDK Integration')}</p>
                </div>
            </div>
            <div className="space-y-8">
                <div>
                    <label className="text-[10px] uppercase font-black text-white/30 mb-3 block tracking-[0.2em]">{t('home.amount_label', 'Somme à verser')}</label>
                    <div className="relative group">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="w-full pl-6 pr-16 py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-3xl text-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500/50 transition-all outline-none shadow-inner"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-3xl text-yellow-500/20 group-focus-within:text-yellow-500 transition-colors">π</span>
                    </div>
                </div>
                <BaseButton onClick={handlePayment} disabled={loading} variant="primary" className="w-full py-6">
                    {loading ? t('common.loading', 'Transaction...') : t('home.confirm_deposit', `Confirmer le Dépôt`)}
                </BaseButton>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
        </Card>
        </div>
    );
}

interface Transaction {
    amount: number;
    memo: string;
    createdAt: string;
    status: string;
}

function TransactionHistory() {
    const { t } = useTranslation();
    const [history, setHistory] = useState<Transaction[]>([]);

    useEffect(() => {
        ApiService.getHistory().then(res => setHistory(res.data.payments || []));
    }, []);

    return (
        <Card className="p-0 overflow-hidden shadow-2xl border-white/5 bg-white/5 backdrop-blur-3xl rounded-[2.5rem]">
            <div className="p-10 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-white uppercase tracking-[0.2em] text-xs mb-1">{t('home.activity_title', "Journal d'Activités")}</h3>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{t('home.real_time', 'Temps réel')}</p>
                </div>
                <BaseButton variant="secondary" className="px-6 py-3 border-white/10 text-[10px]">{t('home.see_history', 'Voir Historique')}</BaseButton>
            </div>
            <div className="divide-y divide-white/5">
                {history.length > 0 ? (
                  history.slice(0, 5).map((tx, i) => (
                    <div key={i} className="p-8 hover:bg-white/[0.03] flex items-center justify-between transition-all duration-300 group">
                        <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110 border ${tx.amount > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white tracking-tight group-hover:text-yellow-400 transition-colors">{tx.memo || t('common.system', 'Système')}</p>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1.5">{new Date(tx.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-2">
                                <p className={`text-xl font-black tracking-tighter ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </p>
                                <span className={`text-xs font-black opacity-20 ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>π</span>
                            </div>
                            <StatusBadge status={tx.status?.toLowerCase() || 'pending'} />
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                         <Activity size={24} className="text-white/10" />
                      </div>
                      <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">{t('home.no_data', 'Aucune donnée disponible')}</p>
                  </div>
                )}
            </div>
        </Card>
    );
}
