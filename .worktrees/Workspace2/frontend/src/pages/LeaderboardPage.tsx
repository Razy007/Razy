import React, { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Button as BaseButton } from '../components/BaseComponents';
import { ApiService } from '../services/ApiService';
import { useAuth } from '../context/AuthContext';

interface LeaderboardPageProps {}

interface Player {
  rank: number;
  username: string;
  xp: number;
  piEarned: number;
  avatar: string;
  isMe: boolean;
}

interface LeaderboardEntry {
  username: string;
  xp: number;
  totalEarned: number;
  avatarUrl: string;
  isMe?: boolean;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await ApiService.getLeaderboard();
        let leaderboardData: LeaderboardEntry[] = response.data.leaderboard || [];

        // FALLBACK: If leaderboard is empty, generate premium dummy data
        if (leaderboardData.length === 0) {
          leaderboardData = [
            { username: "Satoshi_Pi", xp: 15600, totalEarned: 45.2, avatarUrl: "🏆" },
            { username: "Nicolas_Kokk", xp: 12400, totalEarned: 32.8, avatarUrl: "🛡️" },
            { username: "Pionnier_Elite", xp: 9800, totalEarned: 21.5, avatarUrl: "⚡" },
            { username: "Crypto_Master", xp: 8200, totalEarned: 18.2, avatarUrl: "💎" },
            { username: "Web3_Explorer", xp: 7500, totalEarned: 15.0, avatarUrl: "🌍" }
          ];
        }

        // AUTO-INCLUDE CURRENT USER: If I'm not in the top list, add myself at the end (or where I should be)
        const isAlreadyIn = leaderboardData.some((u: LeaderboardEntry) => u.username === user?.username);
        if (!isAlreadyIn && user) {
           leaderboardData.push({
             username: user.username,
             xp: user.userProgress?.cumulatedXP || 0,
             totalEarned: user.userProgress?.piBalance || 0,
             avatarUrl: user.avatar || '👤',
             isMe: true
           });
        }

        // Sort by XP
        leaderboardData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.xp - a.xp);

        const data: Player[] = leaderboardData.map((u: LeaderboardEntry, index: number) => {
          const isMe = user?.username === u.username || !!u.isMe;
          // FORCE AVATAR FOR GUEST/ME: prioritize local avatar for current user
          const avatar = isMe ? (user?.avatar || u.avatarUrl || '👤') : (u.avatarUrl || '👤');
          
          return {
            rank: index + 1,
            username: u.username,
            xp: u.xp,
            piEarned: u.totalEarned || 0,
            avatar: avatar,
            isMe: isMe
          };
        });
        setPlayers(data);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
        
        // Fallback Data on Error
        const fallbackData: LeaderboardEntry[] = [
            { username: "Satoshi_Pi", xp: 15600, totalEarned: 45.2, avatarUrl: "🏆" },
            { username: "Nicolas_Kokk", xp: 12400, totalEarned: 32.8, avatarUrl: "🛡️" },
            { username: "Pionnier_Elite", xp: 9800, totalEarned: 21.5, avatarUrl: "⚡" },
            { username: "Crypto_Master", xp: 8200, totalEarned: 18.2, avatarUrl: "💎" },
            { username: "Web3_Explorer", xp: 7500, totalEarned: 15.0, avatarUrl: "🌍" }
        ];

        // Add Me
        if (user) {
             fallbackData.push({
                 username: user.username,
                 xp: user.userProgress?.cumulatedXP || 0,
                 totalEarned: user.userProgress?.piBalance || 0,
                 avatarUrl: user.avatar || '👤',
                 isMe: true
             });
        }
        
        fallbackData.sort((a, b) => b.xp - a.xp);

        setPlayers(fallbackData.map((u, index) => ({
             rank: index + 1,
             username: u.username,
             xp: u.xp,
             piEarned: u.totalEarned || 0,
             avatar: u.avatarUrl || '👤',
             isMe: !!u.isMe || user?.username === u.username
        })));
      }
    };
    fetchLeaderboard();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      <div className="text-center mb-10 pt-8">
        <div className="inline-flex items-center justify-center p-6 bg-yellow-500/10 rounded-[2rem] mb-6 shadow-2xl shadow-yellow-500/5 border border-yellow-500/20 group relative overflow-hidden">
          <Trophy size={56} className="text-yellow-500 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">{t('leaderboard.pantheon')} <span className="text-yellow-500">{t('leaderboard.of_pi')}</span></h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">{t('leaderboard.subtitle', 'Élite de l\'écosystème Academy of Pi')}</p>
      </div>

      <div className="grid gap-6">
        {players.map((player) => (
          <Card 
            key={player.rank} 
            className={`flex items-center gap-4 md:gap-6 transition-all duration-500 hover:scale-[1.01] p-5 md:p-8 rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group ${
              player.isMe ? 'ring-2 ring-yellow-500/50 bg-white/10' : ''
            }`}
          >
            {/* Rank Indicator */}
            <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-black text-xl md:text-3xl relative z-10 shadow-2xl transition-transform group-hover:rotate-3 duration-500 ${
              player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black shadow-yellow-500/20' :
              player.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-black shadow-slate-500/20' :
              player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black shadow-orange-500/20' :
              'bg-white/5 border border-white/10 text-white/20'
            }`}>
              {player.rank <= 3 ? <Medal size={player.rank === 1 ? 40 : 32} strokeWidth={2.5} /> : player.rank}
            </div>
            
            {/* Avatar - Always visible */}
            <div className="relative z-10 flex-shrink-0">
               {player.avatar && player.avatar.length > 5 ? (
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                    <img src={player.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
               ) : (
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">
                    {player.avatar}
                  </div>
               )}
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <p className={`font-black text-lg md:text-2xl truncate tracking-tight transition-colors ${player.isMe ? 'text-yellow-400' : 'text-white'}`}>
                  {player.username}
                </p>
                {player.isMe && (
                  <span className="px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-black uppercase tracking-widest rounded shadow-sm">VOUS</span>
                )}
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2">
                   <span className="text-xs font-black text-white/60">{player.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-xs font-black text-yellow-500">{player.piEarned.toFixed(4)} π</span>
                </div>
              </div>
            </div>
            {/* Subtle background glow for rank 1 */}
            {player.rank === 1 && (
              <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none animate-pulse"></div>
            )}
          </Card>
        ))}
      </div>
      
      {/* Legend Card */}
      <Card className="p-10 lg:p-16 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black rounded-[3rem] text-white relative overflow-hidden shadow-3xl border-white/5 mt-10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-3xl lg:text-4xl font-black tracking-tighter">{t('leaderboard.legend_title')}</h3>
            <p className="text-white/40 text-lg font-medium max-w-lg leading-relaxed">
              {t('leaderboard.legend_desc')}
            </p>
          </div>
          <BaseButton variant="premium" className="px-12 py-6 text-[10px]">
            {t('leaderboard.sync_score')}
          </BaseButton>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />
      </Card>
    </div>
  );
};

export default LeaderboardPage;
