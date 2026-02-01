import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Card } from '../components/BaseComponents';
import { ApiService } from '../services/ApiService';
import { Users, Trophy, Star, Calendar, Shield, Heart, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface PublicUser {
  id: number;
  username: string;
  level: number;
  xp: number;
  avatar: string;
  role: string;
  streak: number;
  totalEarned: number;
  createdAt: string;
}

// Interfaces for Social Posts
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

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  // const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        // Fetch Profile
        const profileRes = await ApiService.getPublicUserProfile(userId);
        if (profileRes.data && profileRes.data.success) {
           setProfile(profileRes.data.user);
        } else {
           setError(true);
        }

        // Fetch Posts
        const postsRes = await ApiService.getSocialUserPosts(userId);
        if (postsRes.data && postsRes.data.success && Array.isArray(postsRes.data.data)) {
            setPosts(postsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch public profile or posts", err);
        setError(true);
        toast.error("Impossible de charger le profil complet");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [userId]);

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
      }
  };

  if (!userId) return <Navigate to="/" />;
  
  if (currentUser && profile && currentUser.uid === profile.id.toString()) {
       return <Navigate to="/profile" />;
  }

  if (loading) {
     return (
        <div className="flex justify-center items-center py-20">
           <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
     );
  }

  if (error || !profile) {
      return (
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
            <Users size={64} className="mx-auto text-white/20" />
            <h2 className="text-2xl font-bold text-white">Profil introuvable</h2>
            <p className="text-white/50">Cet utilisateur n&apos;existe pas ou est inaccessible.</p>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out pb-20">
      
      {/* Header Card */}
      <Card className="p-10 md:p-14 overflow-hidden relative border-white/5 shadow-3xl bg-white/5 backdrop-blur-3xl rounded-[3rem]">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           {/* Avatar */}
           <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-1 shadow-2xl shadow-blue-500/20">
                <div className="w-full h-full bg-[#0f172a] rounded-[2.2rem] flex items-center justify-center overflow-hidden border border-white/10 relative">
                   {profile.avatar ? (
                     <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-7xl drop-shadow-2xl">👤</span>
                   )}
                </div>
              </div>
           </div>

           {/* Info */}
           <div className="flex-1 text-center md:text-left space-y-4">
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">{profile.username}</h2>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-3">
                   <div className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-yellow-500/10 shadow-inner flex items-center gap-2">
                      <Trophy size={12} /> Niveau {profile.level}
                   </div>
                   <div className="px-4 py-1.5 bg-purple-500/10 text-purple-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-purple-500/10 shadow-inner flex items-center gap-2">
                      <Star size={12} /> {profile.xp} XP
                   </div>
               </div>

                <div className="grid grid-cols-2 gap-4 mt-6 max-w-sm mx-auto md:mx-0">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Membre depuis</p>
                        <p className="font-bold text-white flex items-center justify-center gap-2">
                            <Calendar size={14} className="text-blue-400" />
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Série</p>
                        <p className="font-bold text-white flex items-center justify-center gap-2">
                             <Shield size={14} className="text-orange-400" />
                             {profile.streak} Jours
                        </p>
                    </div>
                </div>

           </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />
      </Card>

      {/* User Posts Feed */}
      <div className="space-y-6 md:space-y-8">
          <h3 className="text-2xl font-bold text-white px-4">Publications récentes</h3>
          
          {posts.length === 0 && !loading && (
              <div className="text-center py-10 opacity-50">
                  <p className="text-white">Aucune publication pour le moment.</p>
              </div>
          )}

          <div className="grid gap-6 md:gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="p-6 md:p-10 bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem] group">
                   {/* Post Header & Content */}
                   <div className="flex items-start gap-4 mb-6">
                       <Link to={`/user/${post.id_User}`} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl border border-white/10 shrink-0">
                           {post.avatar}
                       </Link>
                       <div>
                           <Link to={`/user/${post.id_User}`} className="font-black text-white text-lg">
                                {post.user}
                           </Link>
                           <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{post.time}</p>
                       </div>
                   </div>
                   
                   <p className="text-white/80 text-lg font-medium leading-relaxed mb-8">
                      {post.content}
                   </p>
    
                   {/* Actions Buttons */}
                   <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${post.isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-white/60 hover:text-red-400'}`}
                      >
                        <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} /> <span className="text-xs font-black">{post.likes}</span>
                      </button>
                      
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white/60">
                        <MessageCircle size={18} /> <span className="text-xs font-black">{post.comments || 0}</span>
                      </div>
                      
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-green-500/20 text-white/60 hover:text-green-400 ml-auto transition-colors">
                        <Share2 size={18} />
                      </button>
                   </div>
                </Card>
              ))}
          </div>
      </div>
      
    </div>
  );
};

export default UserProfilePage;
