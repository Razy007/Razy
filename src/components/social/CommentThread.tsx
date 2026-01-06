import React, { useState } from 'react';
import { Heart, MessageCircle, Trash2, Send, ChevronDown, ChevronUp } from 'lucide-react';

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    username: string;
    avatar: string;
    content: string;
    timestamp: number;
    likes: number;
    likedBy: string[];
    parentId: string | null; // null for top-level comments
    replies?: Comment[];
}

interface CommentThreadProps {
    postId: string;
    comments: Comment[];
    currentUserId: string;
    currentUsername: string;
    currentAvatar: string;
    onAddComment: (postId: string, content: string, parentId: string | null) => void;
    onLikeComment: (commentId: string) => void;
    onDeleteComment: (commentId: string) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
    postId,
    comments,
    currentUserId,
    currentUsername,
    currentAvatar,
    onAddComment,
    onLikeComment,
    onDeleteComment
}) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    
    // Emoji picker for quick reactions
    const quickEmojis = ['👍', '🔥', '🚀', '❤️', '👏', '😂', '💡', '💎'];

    // Organize comments into threads
    const topLevelComments = comments.filter(c => c.parentId === null);
    
    const getReplies = (commentId: string): Comment[] => {
        return comments.filter(c => c.parentId === commentId);
    };

    const formatTimeAgo = (timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `il y a ${minutes}min`;
        if (hours < 24) return `il y a ${hours}h`;
        return `il y a ${days}j`;
    };

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;
        onAddComment(postId, newComment, null);
        setNewComment('');
    };

    const handleSubmitReply = (parentId: string) => {
        if (!replyContent.trim()) return;
        onAddComment(postId, replyContent, parentId);
        setReplyContent('');
        setReplyingTo(null);
    };

    const toggleExpanded = (commentId: string) => {
        const newExpanded = new Set(expandedComments);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedComments(newExpanded);
    };

    const renderComment = (comment: Comment, depth: number = 0) => {
        const replies = getReplies(comment.id);
        const isExpanded = expandedComments.has(comment.id);
        const isLiked = comment.likedBy.includes(currentUserId);
        const isOwner = comment.userId === currentUserId;

        return (
            <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-2' : 'mt-3'}`}>
                <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition">
                    {/* Comment Header */}
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">{comment.avatar}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-white text-sm">
                                    {comment.username}
                                </span>
                                <span className="text-white/50 text-xs">
                                    {formatTimeAgo(comment.timestamp)}
                                </span>
                            </div>
                            
                            {/* Comment Content */}
                            <p className="text-white/90 text-sm mb-2 break-words whitespace-pre-wrap">
                                {comment.content}
                            </p>

                            {/* Comment Actions */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => onLikeComment(comment.id)}
                                    className={`flex items-center gap-1 text-xs transition ${
                                        isLiked ? 'text-red-400' : 'text-white/60 hover:text-red-400'
                                    }`}
                                >
                                    <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                                    <span>{comment.likes}</span>
                                </button>

                                <button
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="flex items-center gap-1 text-xs text-white/60 hover:text-blue-400 transition"
                                >
                                    <MessageCircle size={14} />
                                    <span>Répondre</span>
                                </button>

                                {replies.length > 0 && (
                                    <button
                                        onClick={() => toggleExpanded(comment.id)}
                                        className="flex items-center gap-1 text-xs text-white/60 hover:text-yellow-400 transition"
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        <span>{replies.length} {replies.length === 1 ? 'réponse' : 'réponses'}</span>
                                    </button>
                                )}

                                {isOwner && (() => {
                                    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
                                    const commentAge = Date.now() - comment.timestamp;
                                    const canDelete = commentAge < twoWeeksInMs;
                                    
                                    return (
                                        <button
                                            onClick={() => {
                                                if (!canDelete) {
                                                    alert('❌ Impossible de supprimer ce commentaire.\n\nLes commentaires de plus de 2 semaines ne peuvent plus être supprimés.');
                                                    return;
                                                }
                                                if (window.confirm('Supprimer ce commentaire ?')) {
                                                    onDeleteComment(comment.id);
                                                }
                                            }}
                                            className={`flex items-center gap-1 text-xs transition ml-auto ${
                                                canDelete 
                                                    ? 'text-white/60 hover:text-red-400' 
                                                    : 'text-white/30 cursor-not-allowed'
                                            }`}
                                            title={canDelete ? 'Supprimer' : 'Commentaire verrouillé (>2 semaines)'}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                        <div className="mt-3 ml-11 flex flex-col gap-2 animate-fadeIn relative z-10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply(comment.id)}
                                    placeholder={`Répondre à ${comment.username}...`}
                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-400 min-w-0" // min-w-0 prevents flex stretch
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleSubmitReply(comment.id)}
                                    className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition shrink-0"
                                >
                                    <Send size={16} className="text-white" />
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent('');
                                }}
                                className="text-white/60 text-xs hover:text-white self-start ml-1"
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                </div>

                {/* Nested Replies */}
                {isExpanded && replies.length > 0 && (
                    <div className="mt-2">
                        {replies.map(reply => renderComment(reply, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mt-4">
            {/* New Comment Input */}
            <div className="flex gap-2 mb-4">
                <div className="text-2xl">{currentAvatar}</div>
                <div className="flex-1 min-w-0">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                        placeholder="Ajouter un commentaire..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                    />
                    {/* Emoji Quick Selector */}
                    <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
                        {quickEmojis.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => setNewComment(prev => prev + emoji)}
                                className="bg-white/5 hover:bg-white/10 p-1.5 rounded text-sm transition border border-white/5"
                                title={`Ajouter ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition self-start"
                >
                    <Send size={20} className="text-black" />
                </button>
            </div>

            {/* Comments List */}
            <div className="space-y-2">
                {topLevelComments.length === 0 ? (
                    <p className="text-white/50 text-sm text-center py-4">
                        Aucun commentaire. Soyez le premier à commenter !
                    </p>
                ) : (
                    topLevelComments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    );
};
