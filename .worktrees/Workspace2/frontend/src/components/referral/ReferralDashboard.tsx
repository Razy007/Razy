import React, { useState, useEffect, useCallback } from 'react';
import { Users, Copy, TrendingUp, Award, Gift, Share2, X, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReferralAPI from '../../services/ReferralAPI';

interface ReferralStats {
    totalReferrals: number;
    activeReferrals: number;
    pendingReferrals?: number;
    totalEarnings: {
        xp: number;
        pi: number;
    };
    milestones?: Record<string, { unlocked: boolean }>;
}

interface ReferralUser {
    username: string;
    avatar: string;
    level: number;
    status: 'active' | 'pending' | 'inactive';
    signupDate: string;
    rewardsEarned: {
        totalXP: number;
        totalPi: number;
    };
    milestones?: Record<string, { completed: boolean; date?: string }>;
}

interface ReferralData {
    code: {
        referralCode: string;
        shareLink: string;
        stats?: ReferralStats;
    };
    stats: {
        stats: ReferralStats;
        referrals: ReferralUser[];
        pendingRewards: {
            xp: number;
            pi: number;
            badges: string[];
        };
    };
}

interface ReferralDashboardProps {
  userToken: string;
  onClose: () => void;
}

interface MilestoneTier {
    tier: string;
    count: number;
    xp: number;
    pi: number;
    label: string;
    badge?: string;
    special?: string;
}

export const ReferralDashboard: React.FC<ReferralDashboardProps> = ({ userToken, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [claiming, setClaiming] = useState(false);

  const loadReferralData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Pour l'instant, utiliser des données mockées si pas de token valide ou mode guest
      if (!userToken || userToken === 'MOCK' || userToken === 'guest_token' || userToken.startsWith('guest')) {
        // Données mockées pour démo
        setReferralData({
          code: {
            referralCode: 'PIAA8F3D2',
            shareLink: 'https://piacademy.com/ref/PIAA8F3D2',
            stats: {
              totalReferrals: 3,
              activeReferrals: 2,
              totalEarnings: {
                xp: 175,
                pi: 0.0003
              }
            }
          },
          stats: {
            stats: {
              totalReferrals: 3,
              activeReferrals: 2,
              pendingReferrals: 1,
              totalEarnings: {
                xp: 175,
                pi: 0.0003
              },
              milestones: {
                tier5: { unlocked: false },
                tier10: { unlocked: false }
              }
            },
            referrals: [
              {
                username: 'Pioneer456',
                avatar: '👤',
                level: 3,
                status: 'active',
                signupDate: new Date().toISOString(),
                milestones: {
                  firstCourseCompleted: { completed: true, date: new Date().toISOString() },
                  level5Reached: { completed: false }
                },
                rewardsEarned: {
                  totalXP: 75,
                  totalPi: 0.0002
                }
              },
              {
                username: 'CryptoLearner',
                avatar: '🎓',
                level: 2,
                status: 'active',
                signupDate: new Date().toISOString(),
                milestones: {
                  firstCourseCompleted: { completed: false },
                  level5Reached: { completed: false }
                },
                rewardsEarned: {
                  totalXP: 50,
                  totalPi: 0.0001
                }
              },
              {
                username: 'PiEnthusiast',
                avatar: '🚀',
                level: 1,
                status: 'pending',
                signupDate: new Date().toISOString(),
                milestones: {
                  firstCourseCompleted: { completed: false },
                  level5Reached: { completed: false }
                },
                rewardsEarned: {
                  totalXP: 50,
                  totalPi: 0.0001
                }
              }
            ],
            pendingRewards: {
              xp: 75,
              pi: 0.0001,
              badges: []
            }
          }
        });
      } else {
        const [codeData, statsData] = await Promise.all([
          ReferralAPI.getMyReferralCode(userToken),
          ReferralAPI.getStats(userToken)
        ]);

        setReferralData({
          code: codeData.data,
          stats: statsData.data
        });
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
      alert(t('referral.error_loading'));
    } finally {
      setLoading(false);
    }
  }, [userToken, t]);

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]);

  const handleClaimRewards = async () => {
    if (claiming || !referralData) return;
    
    try {
      setClaiming(true);
      
      // Mode mock
      if (!userToken || userToken === 'MOCK') {
        alert(t('referral.rewards_claimed', { xp: referralData.stats.pendingRewards.xp, pi: referralData.stats.pendingRewards.pi.toFixed(6) }));
        
        // Réinitialiser les récompenses en attente
        setReferralData({
          ...referralData,
          stats: {
            ...referralData.stats,
            pendingRewards: {
              xp: 0,
              pi: 0,
              badges: []
            }
          }
        });
        return;
      }
      
      const result = await ReferralAPI.claimRewards(userToken);
      
      if (result.success) {
        alert(t('referral.rewards_claimed_balance', { 
            xp: result.data.claimed.xp, 
            pi: result.data.claimed.pi.toFixed(6),
            newXp: result.data.newBalance.xp,
            newPi: result.data.newBalance.pi.toFixed(6)
        }));
        loadReferralData(); // Recharger les données
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert(t('referral.error_claiming'));
    } finally {
      setClaiming(false);
    }
  };

  const copyLink = () => {
    const success = ReferralAPI.copyToClipboard(referralData?.code.shareLink || '');
    if (success) {
      alert(t('referral.link_copied'));
    } else {
      alert(t('referral.link_copy_error'));
    }
  };

  const copyCode = () => {
    const success = ReferralAPI.copyToClipboard(referralData?.code.referralCode || '');
    if (success) {
      alert(t('referral.code_copied'));
    } else {
      alert(t('referral.code_copy_error'));
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8">
          <p className="text-white text-xl">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const { code, stats } = referralData || {};
  const hasPendingRewards = (stats?.pendingRewards?.xp || 0) > 0 || (stats?.pendingRewards?.pi || 0) > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-400/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-orange-500 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-black flex items-center gap-2">
              <Users size={28} />
              {t('referral.title')}
            </h2>
            <p className="text-black/80 text-sm mt-1">{t('referral.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-black/20 hover:bg-black/30 p-2 rounded-lg transition"
          >
            <X size={24} className="text-black" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Code de Parrainage */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/30">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Share2 size={20} className="text-yellow-400" />
              {t('referral.your_code')}
            </h3>
            
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <p className="text-purple-300 text-sm mb-2">{t('referral.unique_code')}</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-mono font-bold text-2xl flex-1">{code?.referralCode}</p>
                <button
                  onClick={copyCode}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition flex items-center gap-2"
                >
                  <Copy size={16} />
                  {t('referral.copy')}
                </button>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <p className="text-purple-300 text-sm mb-2">{t('referral.share_link')}</p>
              <div className="flex items-center gap-2">
                <p className="text-white text-sm flex-1 break-all">{code?.shareLink}</p>
                <button
                  onClick={copyLink}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition whitespace-nowrap flex items-center gap-2"
                >
                  <Share2 size={16} />
                  {t('referral.share')}
                </button>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm">
                💡 <strong>{t('referral.how_works_title')}</strong><br />
                {t('referral.how_works_desc')}
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-purple-400/30">
              <div className="flex items-center justify-between mb-2">
                <Users size={20} className="text-purple-400" />
              </div>
              <p className="text-purple-300 text-xs mb-1">{t('referral.stats_total')}</p>
              <p className="text-white text-2xl font-bold">{stats?.stats?.totalReferrals || 0}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <p className="text-green-300 text-xs mb-1">{t('referral.stats_active')}</p>
              <p className="text-white text-2xl font-bold">{stats?.stats?.activeReferrals || 0}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-yellow-400/30">
              <div className="flex items-center justify-between mb-2">
                <Award size={20} className="text-yellow-400" />
              </div>
              <p className="text-yellow-300 text-xs mb-1">{t('referral.stats_xp')}</p>
              <p className="text-white text-2xl font-bold">{stats?.stats?.totalEarnings?.xp || 0}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-orange-400/30">
              <div className="flex items-center justify-between mb-2">
                <Gift size={20} className="text-orange-400" />
              </div>
              <p className="text-orange-300 text-xs mb-1">{t('referral.stats_pi')}</p>
              <p className="text-white text-2xl font-bold">{(stats?.stats?.totalEarnings?.pi || 0).toFixed(6)}π</p>
            </div>
          </div>

          {/* Récompenses en Attente */}
          {hasPendingRewards && stats?.pendingRewards && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border-2 border-green-400/30">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Gift size={20} className="text-green-400 animate-pulse" />
                {t('referral.pending_rewards')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <p className="text-yellow-400 text-3xl font-bold">{stats.pendingRewards.xp}</p>
                  <p className="text-white/70 text-sm">XP</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <p className="text-orange-400 text-3xl font-bold">{stats.pendingRewards.pi.toFixed(6)}</p>
                  <p className="text-white/70 text-sm">Pi</p>
                </div>
              </div>

              <button
                onClick={handleClaimRewards}
                disabled={claiming}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold py-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {claiming ? `⏳ ${t('referral.claiming')}` : `💰 ${t('referral.claim_button')}`}
              </button>
            </div>
          )}

          {/* Liste des Filleuls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-xl mb-4">{t('referral.my_referrals')} ({stats?.referrals?.length || 0})</h3>
            
            {!stats?.referrals || stats.referrals.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle size={48} className="text-purple-400 mx-auto mb-4" />
                <p className="text-white/70">{t('referral.no_referrals')}</p>
                <p className="text-white/50 text-sm mt-2">{t('referral.start_sharing')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.referrals.map((referral, index) => (
                  <div
                    key={index}
                    className="bg-black/30 rounded-lg p-4 flex items-center justify-between hover:bg-black/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{referral.avatar}</span>
                      <div>
                        <p className="text-white font-semibold">{referral.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-purple-300 text-xs">{t('stats.level')} {referral.level}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            referral.status === 'active' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {referral.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">{referral.rewardsEarned.totalXP} XP</p>
                      <p className="text-orange-400 text-sm">{referral.rewardsEarned.totalPi.toFixed(6)}π</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paliers */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Award size={20} className="text-yellow-400" />
              {t('referral.milestones_title')}
            </h3>
            
            <div className="space-y-3">
              {[
                { tier: 'tier5', count: 5, xp: 500, pi: 0.001, label: t('referral.tiers.five_active') },
                { tier: 'tier10', count: 10, xp: 1500, pi: 0.005, label: t('referral.tiers.ten_active'), badge: 'Referral Master' },
                { tier: 'tier25', count: 25, xp: 0, pi: 0, label: t('referral.tiers.twentyfive_active'), special: t('referral.tiers.free_premium') },
                { tier: 'tier50', count: 50, xp: 0, pi: 0, label: t('referral.tiers.fifty_active'), special: t('referral.tiers.legendary_badge') }
              ].map((tier: MilestoneTier) => {
                const unlocked = stats?.stats?.milestones?.[tier.tier]?.unlocked;
                const progress = Math.min((stats?.stats?.activeReferrals || 0) / tier.count * 100, 100);
                
                return (
                  <div
                    key={tier.tier}
                    className={`rounded-lg p-4 border ${
                      unlocked
                        ? 'bg-green-500/20 border-green-400/30'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{tier.label}</p>
                        <p className="text-white/70 text-sm">
                          {tier.special || `${tier.xp} XP + ${tier.pi}π${tier.badge ? ' + ' + tier.badge : ''}`}
                        </p>
                      </div>
                      {unlocked && <span className="text-green-400 text-2xl">✓</span>}
                    </div>
                    {!unlocked && (
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
