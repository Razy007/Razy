import React, { useState } from 'react';
import { Users, X, Send, MessageCircle, Heart, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Button as BaseButton } from '../components/BaseComponents';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/ApiService';

// Interfaces
interface Comment {
  id: number;
  id_User: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface SocialPost {
  id: number;
  id_User: string; 
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  isLiked: boolean;
  comments: number;
  replies: Comment[];
}

const SocialPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');
  
  // States for Comments logic
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [replyToId, setReplyToId] = useState<number | null>(null); // Comment ID to reply to
  const [commentContent, setCommentContent] = useState('');
  
  const [posts, setPosts] = useState<SocialPost[]>([]);

  // Load from API on mount and Poll every 15s
  React.useEffect(() => {
     const fetchPosts = () => {
        ApiService.getSocialPosts()
            .then(res => {
                if(res.data && res.data.success && Array.isArray(res.data.data)) {
                    setPosts(res.data.data);
                }
            })
            .catch(err => {
                console.log('Social API Offline', err);
            });
     };

     fetchPosts(); // Initial
     const interval = setInterval(fetchPosts, 15000); // Poll every 15s

     return () => clearInterval(interval);
  }, []);

  const handlePost = async () => {
    if (!postContent.trim()) {
        toast.error("Votre message est vide !");
        return;
    }
    const optimisticId = Date.now();
    const newPost: SocialPost = {
      id: optimisticId, // Optimistic ID
      id_User: user?.uid || '', // String ID
      user: user?.username || 'Pionnier',
      avatar: user?.avatar || '👤',
      time: t('social.just_now'),
      content: postContent,
      likes: 0,
      isLiked: false,
      comments: 0,
      replies: []
    };
    setPosts(prev => [newPost, ...prev]);
    setPostContent('');
    toast.success(t('social.post_shared', 'Publication partagée !'));
    
    try { 
        const res = await ApiService.createSocialPost(postContent); 
        if (res.data && res.data.success) {
            // SWAP optimistic ID with Real ID to enable commenting
            const realPost = res.data.data;
            setPosts(prev => prev.map(p => p.id === optimisticId ? realPost : p));
        }
    } catch (e) {
        console.error("Post sync failed", e);
    }
  };

  const handleComment = async (postId: number) => {
      if (!commentContent.trim()) return;

      const newComment: Comment = {
          id: Date.now(),
          id_User: user?.uid || '',
          user: user?.username || 'Pionnier',
          avatar: user?.avatar || '👤',
          content: commentContent,
          time: t('social.just_now'),
          likes: 0,
          isLiked: false,
          replies: []
      };

      setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === postId) {
              const updatedPost = { ...p };
              
              if (replyToId) {
                  const parentComment = updatedPost.replies.find((c: Comment) => c.id === replyToId);
                  if (parentComment) {
                      if (!parentComment.replies) parentComment.replies = [];
                      parentComment.replies.push(newComment);
                  } else {
                      updatedPost.replies.unshift(newComment);
                  }
              } else {
                 updatedPost.replies.unshift(newComment);
              }
              
              updatedPost.comments = (updatedPost.comments || 0) + 1;
              return updatedPost;
          }
          return p;
      }));
      
      const contentToSend = commentContent;
      const parentIdToSend = replyToId;

      setCommentContent('');
      setReplyToId(null); 
      toast.success('Commentaire ajouté !');

      try {
          await ApiService.addComment(postId, contentToSend, parentIdToSend || undefined);
          // Ideally fetch back to get real ID
      } catch (e) {
          console.error("Failed to add comment", e);
      }
  };

  const toggleComments = (postId: number) => {
      if (activePostId === postId) {
          setActivePostId(null);
          setReplyToId(null);
      } else {
          setActivePostId(postId);
      }
  };

  const handleLikePost = async (postId: number) => {
      // Optimistic Update
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              return {
                  ...p,
                  likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                  isLiked: !p.isLiked
              };
          }
          return p;
      }));

      try {
          await ApiService.toggleLikePost(postId);
      } catch (e) {
          console.error("Like failed", e);
          // Revert if needed, but for now silent fail is okay for likes
      }
  };

  const handleLikeComment = async (postId: number, commentId: number) => {
      // Optimistic Update Complex Nested
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
               const updatedReplies = p.replies.map(c => {
                   // Search Top Level
                   if (c.id === commentId) {
                       return { ...c, likes: (c.likes || 0) + (c.isLiked ? -1 : 1), isLiked: !c.isLiked };
                   }
                   // Search Nested
                   if (c.replies) {
                       const nestedUpdated = c.replies.map(r => {
                           if (r.id === commentId) {
                               return { ...r, likes: (r.likes || 0) + (r.isLiked ? -1 : 1), isLiked: !r.isLiked };
                           }
                           return r;
                       });
                       return { ...c, replies: nestedUpdated };
                   }
                   return c;
               });
               return { ...p, replies: updatedReplies };
          }
          return p;
      }));

      try {
          await ApiService.toggleLikeComment(commentId);
      } catch (e) {
          console.error("Comment like failed", e);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out pb-20">
      
      {/* Header */}
      <div className="text-center space-y-4 md:space-y-6 px-4">
        <div className="inline-flex items-center justify-center p-4 md:p-6 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 shadow-2xl shadow-blue-500/5 mb-2 relative group overflow-hidden">
          <Users size={40} className="md:w-14 md:h-14 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
          {t('social.title_main', 'Intelligence')} <span className="text-blue-500">{t('social.title_highlight', 'Collective')}</span>
        </h2>
      </div>

      {/* Post Creator */}
      <div className="px-4">
        <Card className="p-6 md:p-10 bg-white/5 backdrop-blur-3xl border-white/10 shadow-2xl rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden">
            <textarea
            placeholder={t('social.placeholder')}
            className="w-full bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-6 text-white font-medium placeholder:text-white/20 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none min-h-[120px] mb-6 text-base"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            />
            
            <div className="flex justify-end">
                <BaseButton variant="primary" onClick={handlePost} className="px-8 py-3 text-[10px] font-black bg-yellow-500 text-black hover:bg-yellow-400">
                    <Send size={16} className="mr-2" /> {t('social.publish')}
                </BaseButton>
            </div>
        </Card>
      </div>

      {/* Feed */}
      <div className="grid gap-6 md:gap-8 px-4">
          {posts.length === 0 ? (
            /* Empty State - Engaging First Post Encouragement */
            <Card className="p-10 md:p-16 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-3xl border-purple-500/20 rounded-[2.5rem] text-center">
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center text-5xl animate-bounce">
                        👋
                    </div>
                    <div className="absolute inset-0 w-24 h-24 mx-auto bg-purple-500/20 rounded-full animate-ping opacity-20"></div>
                </div>
                <h3 className="text-white font-black text-2xl md:text-3xl mb-4">
                    {t('social.empty_title', 'Bienvenue dans la Communauté !')}
                </h3>
                <p className="text-purple-200/60 text-lg font-medium max-w-md mx-auto mb-8 leading-relaxed">
                    {t('social.empty_desc', 'Soyez le premier à partager votre parcours ! Partagez une victoire, posez une question, ou motivez un fellow Pioneer.')}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full font-bold">💡 Partagez vos tips</span>
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full font-bold">❓ Posez des questions</span>
                    <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full font-bold">🏆 Célébrez vos succès</span>
                </div>
                <p className="text-yellow-400/80 text-sm font-bold mt-8 animate-pulse">
                    ⬆️ {t('social.empty_cta', 'Utilisez le champ ci-dessus pour commencer !')}
                </p>
            </Card>
          ) : posts.map((post) => (
            <Card key={post.id} className="p-6 md:p-10 bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem] group">
               {/* Post Header & Content */}
               <div className="flex items-start gap-4 mb-6">
                   <Link to={`/user/${post.id_User}`} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl border border-white/10 shrink-0 hover:scale-105 transition-transform">
                       {post.avatar}
                   </Link>
                   <div>
                       <Link to={`/user/${post.id_User}`} className="font-black text-white text-lg hover:text-blue-400 transition-colors">
                            {post.user}
                       </Link>
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{post.time}</p>
                   </div>
               </div>
               
               <p className="text-white/80 text-lg font-medium leading-relaxed mb-8">
                  {post.content}
               </p>

               {/* Actions Buttons - CONTRAST FIX: Black Text on Yellow/Orange */}
               <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${post.isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white/60 hover:text-red-400'}`}
                  >
                    <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} /> <span className="text-xs font-black">{post.likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${activePostId === post.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/60 hover:text-white'}`}
                  >
                    <MessageCircle size={18} /> <span className="text-xs font-black">{post.comments || 0}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-green-500/20 text-white/60 hover:text-green-400 ml-auto transition-colors">
                    <Share2 size={18} />
                  </button>
               </div>

               {/* COMMENTS SECTION */}
               {activePostId === post.id && (
                   <div className="mt-8 pt-6 border-t border-white/5 animate-in slide-in-from-top-2">
                       {/* Input Area */}
                       <div className="flex gap-2 mb-8 relative z-20">
                           <input 
                               type="text" 
                               placeholder={replyToId ? t('social.reply_placeholder') : t('social.write_comment')}
                               className={`flex-1 bg-black/30 border ${replyToId ? 'border-yellow-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-colors`}
                               value={commentContent}
                               onChange={(e) => setCommentContent(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                               autoFocus={!!replyToId}
                           />
                           {replyToId && (
                               <button onClick={() => setReplyToId(null)} className="p-3 text-red-400 hover:bg-white/5 rounded-xl"><X size={18}/></button>
                           )}
                           <button 
                                onClick={() => handleComment(post.id)}
                                className="bg-yellow-500 hover:bg-yellow-400 p-3 rounded-xl text-black transition-colors shadow-lg shadow-yellow-500/20"
                           >
                               <Send size={18} />
                           </button>
                       </div>

                       {/* Comments List */}
                       <div className="space-y-6">
                           {post.replies && post.replies.map((comment: Comment) => (
                               <div key={comment.id} className="space-y-3">
                                   {/* Level 1 Comment */}
                                   <div className="flex gap-4">
                                       <Link to={`/user/${comment.id_User}`} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm flex-shrink-0 border border-white/5 hover:scale-105 transition-transform">
                                          {comment.avatar}
                                       </Link>
                                       <div className="flex-1">
                                           <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                                               <div className="flex justify-between items-start mb-1">
                                                   <Link to={`/user/${comment.id_User}`} className="font-bold text-white text-sm hover:text-blue-400 transition-colors">
                                                      {comment.user}
                                                   </Link>
                                                   <span className="text-[10px] text-white/40 font-bold uppercase">{comment.time}</span>
                                               </div>
                                               <p className="text-white/80 text-sm leading-relaxed">{comment.content}</p>
                                           </div>
                                            <div className="flex gap-4 mt-2 ml-2">
                                               <button 
                                                    onClick={() => handleLikeComment(post.id, comment.id)}
                                                    className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${comment.isLiked ? 'text-red-400' : 'text-white/30 hover:text-red-400'}`}
                                               >
                                                   <Heart size={12} fill={comment.isLiked ? "currentColor" : "none"} /> {comment.likes || 0}
                                               </button>
                                               <button 
                                                    onClick={() => { setReplyToId(comment.id); setCommentContent(`@${comment.user} `); }}
                                                    className="text-[10px] font-bold text-blue-400 hover:text-yellow-500 uppercase tracking-widest transition-colors"
                                               >
                                                    {t('social.reply')}
                                               </button>
                                            </div>
                                       </div>
                                   </div>

                                   {/* Level 2 Nested Replies */}
                                   {comment.replies && comment.replies.length > 0 && (
                                       <div className="ml-12 space-y-3 border-l-2 border-white/5 pl-4 py-2">
                                           {comment.replies.map((subReply: Comment) => (
                                               <div key={subReply.id} className="flex gap-3">
                                                   <Link to={`/user/${subReply.id_User}`} className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0 opacity-70 hover:scale-105 transition-transform">
                                                      {subReply.avatar}
                                                   </Link>
                                                   <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/5">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <Link to={`/user/${subReply.id_User}`} className="font-bold text-white/90 text-xs hover:text-blue-400 transition-colors">
                                                              {subReply.user}
                                                            </Link>
                                                            <span className="text-[9px] text-white/30">{subReply.time}</span>
                                                        </div>
                                                        <p className="text-white/70 text-xs">{subReply.content}</p>
                                                        
                                                        {/* Actions for SubReply */}
                                                        <div className="flex gap-3 mt-2">
                                                           <button 
                                                                onClick={() => handleLikeComment(post.id, subReply.id)}
                                                                className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${subReply.isLiked ? 'text-red-400' : 'text-white/20 hover:text-red-400'}`}
                                                            >
                                                                <Heart size={10} fill={subReply.isLiked ? "currentColor" : "none"} /> {subReply.likes || 0}
                                                            </button>
                                                        </div>
                                                   </div>
                                               </div>
                                           ))}
                                       </div>
                                   )}
                               </div>
                           ))}
                       </div>
                   </div>
               )}
            </Card>
          ))}
      </div>
    </div>
  );
};

export default SocialPage;
