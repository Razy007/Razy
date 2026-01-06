
import React from 'react';
import { Users, Star, X, Gift, Send, MessageCircle, Heart } from 'lucide-react'; // Imports adjusted based on usage
import { useTranslation } from 'react-i18next';
import { User, UserProgress, SocialPost } from '../types';
import { CommentThread, Comment } from '../components/social/CommentThread';

interface SocialPageProps {
  user: any; // User type might need to be looser if App.tsx uses a mixed type
  userProgress: UserProgress;
  socialPosts: SocialPost[];
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
  handlePublish: () => void;
  handleDeletePost: (postId: number) => void;
  handleLikeComment: (commentId: string) => void;
  handleAddComment: (postId: string, content: string, parentId: string | null) => void;
  handleDeleteComment: (commentId: string) => void;
  postComments: Record<string, Comment[]>;
  expandedPosts: Set<string>;
  setExpandedPosts: React.Dispatch<React.SetStateAction<Set<string>>>;
  setShowReferralDashboard: (show: boolean) => void;
  copyToClipboard: (text: string) => void;
}

const SocialPage: React.FC<SocialPageProps> = ({
  user,
  userProgress,
  socialPosts,
  postContent,
  setPostContent,
  handlePublish,
  handleDeletePost,
  handleLikeComment,
  handleAddComment,
  handleDeleteComment,
  postComments,
  expandedPosts,
  setExpandedPosts,
  setShowReferralDashboard,
  copyToClipboard
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Users size={48} className="text-yellow-400 mx-auto mb-3" />
        <h3 className="text-white text-3xl font-bold mb-2">💥 {t('nav.social')}</h3>
        <p className="text-purple-300">{t('social.subtitle')}</p>
      </div>

      {/* Referral Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-6 mb-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowReferralDashboard(true)}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-bold text-xl mb-1 flex items-center gap-2">
              <Users size={24} className="text-yellow-400" />
              {t('social.refer_friends')}
            </h4>
            <p className="text-purple-200 text-sm">{t('social.refer_desc')}</p>
          </div>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm">
            {t('social.view_code')}
          </button>
        </div>
      </div>

      {/* Post Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <Star size={24} className="text-yellow-400" />
          {t('social.share_progress')}
        </h4>
        <textarea
          placeholder={t('social.post_placeholder')}
          className="w-full bg-black/30 text-white rounded-lg p-4 mb-3 min-h-[100px] border border-white/20 focus:border-yellow-400 focus:outline-none"
          maxLength={500}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        
        {/* Emoji Picker for New Post */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['🔥', '🚀', '❤️', '👏', '💡', '🎉', '🧠', '💎'].map(emoji => (
            <button
              key={emoji}
              onClick={() => setPostContent(prev => prev + emoji)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-purple-300 text-sm">{t('social.earn_xp_hint')}</span>
          <button
            onClick={handlePublish}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition"
          >
            📤 {t('social.publish')}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h4 className="text-white font-bold text-xl mb-4">📱 Fil d&apos;actualité</h4>
        <div className="space-y-4">
          {[...socialPosts,
          { id: 101, user: 'CryptoLearner', avatar: '🎓', time: '2h', content: 'Je viens de terminer le cours Blockchain! Super instructif 🚀', likes: 24, comments: [] },
          { id: 102, user: 'PiMaster2024', avatar: '👑', time: '5h', content: 'Quelqu\'un a des conseils pour le quiz Cybersécurité?', likes: 15, comments: [] },
          { id: 103, user: 'WebThreeWizard', avatar: '🧙', time: '1j', content: 'Niveau 10 atteint! Merci Pioneer Academy 🎉', likes: 42, comments: [] }
          ].map((post: any) => (
            <div key={post.id} className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    {/* 📸 Smart Avatars */}
                    {post.profilePicture ? (
                       <img src={post.profilePicture} className="w-10 h-10 rounded-full object-cover border border-white/20" alt="Avatar" />
                    ) : (
                       <div className="text-3xl">{post.avatar}</div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-bold">{post.user}</p>
                      <p className="text-purple-300 text-xs">Il y a {post.time}</p>
                    </div>
                    {/* Delete button - only for post owner */}
                    {post.userId === user?.uid && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-400/60 hover:text-red-400 transition"
                        title={t('social.delete_tooltip')}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-white mt-2 break-words">{post.content}</p>
                  
                  <div className="flex gap-4 mt-3 border-t border-white/5 pt-2">
                    <button className="text-purple-300 hover:text-yellow-400 transition flex items-center gap-1 text-sm">
                      ❤️ {post.likes}
                    </button>
                    
                    {/* Collapsible Comment Counter */}
                    <button 
                      className="text-purple-300 hover:text-yellow-400 transition text-sm flex items-center gap-1 font-semibold"
                      onClick={() => {
                          const postId = String(post.id);
                          setExpandedPosts(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(postId)) {
                                  newSet.delete(postId);
                              } else {
                                  newSet.add(postId);
                              }
                              return newSet;
                          });
                      }}
                    >
                      💬 {(postComments[String(post.id)] || []).length || t('social.comment_action')}
                      {(postComments[String(post.id)] || []).length > 0 && (
                          <span className="ml-1 text-xs">
                              {expandedPosts.has(String(post.id)) ? '▼' : '▶'}
                          </span>
                      )}
                    </button>
                  </div>
                  
                  {/* Integrated Comment System - Collapsible */}
                  {expandedPosts.has(String(post.id)) && (
                      <div className="mt-4 border-t border-white/5 pt-2 animate-fadeIn">
                          <CommentThread
                              postId={String(post.id)}
                              comments={postComments[String(post.id)] || []}
                              currentUserId={user?.uid || 'guest'}
                              currentUsername={user?.username || 'Invité'}
                              currentAvatar={user?.avatar || '👤'}
                              onAddComment={handleAddComment}
                              onLikeComment={handleLikeComment}
                              onDeleteComment={handleDeleteComment}
                          />
                      </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-black">
        <Users size={48} className="mx-auto mb-4" />
        <h4 className="text-2xl font-bold mb-2 text-center">{t('social.refer_title')}</h4>
        <p className="text-center mb-4 opacity-90">
          {t('social.refer_text')}
        </p>
        <div className="bg-black/20 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">50 XP</p>
              <p className="text-sm opacity-80">{t('social.per_friend')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">0.0001π</p>
              <p className="text-sm opacity-80">bonus</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => copyToClipboard(`https://piacademy.com/ref/${userProgress.referralCode}`)}
          className="bg-black text-white px-6 py-3 rounded-lg font-bold w-full hover:bg-gray-900 transition"
        >
          {t('social.share_link')}
        </button>
      </div>
    </div>
  );
};

export default SocialPage;
