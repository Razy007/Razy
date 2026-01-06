
import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User, UserProgress } from '../types';

interface LeaderboardPageProps {
  user: User | null;
  userProgress: UserProgress;
  profilePicture: string | null;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ user, userProgress, profilePicture }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Trophy size={48} className="text-yellow-400 mx-auto mb-3" />
        <h3 className="text-white text-3xl font-bold mb-2">🏆 {t('leaderboard.title')}</h3>
        <p className="text-purple-300">{t('leaderboard.subtitle')}</p>
      </div>

      {[
        { rank: 1, username: 'PiMaster2024', xp: 5420, piEarned: 0.0172, avatar: '👑' },
        { rank: 2, username: 'CryptoLearner', xp: 4890, piEarned: 0.0156, avatar: '🎓' },
        { rank: 3, username: 'BlockchainPro', xp: 4350, piEarned: 0.0138, avatar: '⭐' },
        { rank: 4, username: 'WebThreeWizard', xp: 3920, piEarned: 0.0125, avatar: '🧙' },
        { rank: 5, username: 'DigitalPioneer', xp: 3540, piEarned: 0.0113, avatar: '🌟' },
        { rank: 6, username: user?.username, xp: userProgress.xp, piEarned: userProgress.piBalance, avatar: user?.avatar }
      ].map((player, index) => (
        <div
          key={player.rank}
          className={`bg-white/10 backdrop-blur-lg rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-105 ${index < 3 ? 'border-2' : ''
            } ${player.rank === 1 ? 'border-yellow-400 shadow-xl shadow-yellow-400/20' :
              player.rank === 2 ? 'border-gray-300 shadow-xl shadow-gray-300/20' :
                player.rank === 3 ? 'border-orange-400 shadow-xl shadow-orange-400/20' : ''
            }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
            player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
              player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                'bg-white/20 text-white'
            }`}>
            {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-bold text-lg">{player.username}</p>
              {player.rank <= 3 && <Star size={16} className="text-yellow-400" />}
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-purple-300">
                <span className="font-semibold text-white">{player.xp}</span> XP
              </span>
              <span className="text-orange-300">
                <span className="font-semibold text-white">{player.piEarned.toFixed(6)}</span> π
              </span>
            </div>
          </div>
          {/* Show profile picture for current user, emoji for others */}
          {player.username === user?.username && profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
            />
          ) : (
            <div className="text-4xl">{player.avatar}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPage;
