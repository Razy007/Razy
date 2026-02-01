import { Pool } from 'pg';

export interface SocialPost {
  id: number;
  id_User: string;
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  isLiked: boolean; // Added
  comments: number;
  replies: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: number;
  id_User: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes?: number;
  isLiked?: boolean; // Added
  replies?: Comment[];
  createdAt: Date;
}

export class SocialRepository {
  constructor(private db: Pool) {}

  async getAllPosts(currentUserId?: string): Promise<SocialPost[]> {
    // Fetch posts with author info and comment count and isLiked status
    const userIdVal = currentUserId || null; 
    const postsQuery = `
      SELECT p.*, u.username as author_name, u.avatar_url as author_avatar,
      (SELECT COUNT(*) FROM social_comments c WHERE c.post_id = p.id) as comment_count,
      EXISTS(SELECT 1 FROM social_likes l WHERE l.post_id = p.id AND l.user_id = $1) as is_liked
      FROM social_posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 100
    `;
    const postsResult = await this.db.query(postsQuery, [userIdVal]);
    
    // Convert rows to SocialPost entities
    const posts = postsResult.rows.map(row => this.mapPostEntity(row));

    // Fetch all comments for these posts
    if (posts.length > 0) {
        const postIds = posts.map(p => p.id).join(',');
        const commentsQuery = `
            SELECT c.*, u.username as author_name, u.avatar_url as author_avatar,
            EXISTS(SELECT 1 FROM social_likes l WHERE l.comment_id = c.id AND l.user_id = $1) as is_liked
            FROM social_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id IN (${postIds})
            ORDER BY c.created_at ASC
        `;
        const commentsResult = await this.db.query(commentsQuery, [userIdVal]);
        const allComments = commentsResult.rows.map(row => this.mapCommentEntity(row));

        // Map comments to posts
        for (const post of posts) {
            post.replies = this.buildCommentTree(allComments.filter((c: any) => c.postId === post.id));
        }
    }

    return posts;
  }

  async getUserPosts(targetUserId: string, currentUserId?: string): Promise<SocialPost[]> {
    const userIdVal = currentUserId || null; 
    const postsQuery = `
      SELECT p.*, u.username as author_name, u.avatar_url as author_avatar,
      (SELECT COUNT(*) FROM social_comments c WHERE c.post_id = p.id) as comment_count,
      EXISTS(SELECT 1 FROM social_likes l WHERE l.post_id = p.id AND l.user_id = $1) as is_liked
      FROM social_posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $2
      ORDER BY p.created_at DESC
      LIMIT 50
    `;
    // Note: $1 is currentUserId (for like status), $2 is targetUserId (filter)
    const postsResult = await this.db.query(postsQuery, [userIdVal, targetUserId]);
    
    // Convert rows to SocialPost entities
    const posts = postsResult.rows.map(row => this.mapPostEntity(row));

    // Fetch all comments for these posts
    if (posts.length > 0) {
        const postIds = posts.map(p => p.id).join(',');
        const commentsQuery = `
            SELECT c.*, u.username as author_name, u.avatar_url as author_avatar,
            EXISTS(SELECT 1 FROM social_likes l WHERE l.comment_id = c.id AND l.user_id = $1) as is_liked
            FROM social_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id IN (${postIds})
            ORDER BY c.created_at ASC
        `;
        const commentsResult = await this.db.query(commentsQuery, [userIdVal]);
        const allComments = commentsResult.rows.map(row => this.mapCommentEntity(row));

        // Map comments to posts
        for (const post of posts) {
            post.replies = this.buildCommentTree(allComments.filter((c: any) => c.postId === post.id));
        }
    }

    return posts;
  }

  async createPost(userId: string, content: string): Promise<SocialPost> {
    // We insert, then we select back with join to get author info
    const insertQuery = `
      INSERT INTO social_posts (user_id, content)
      VALUES ($1, $2)
      RETURNING id
    `;
    const insertRes = await this.db.query(insertQuery, [userId, content]);
    const newPostId = insertRes.rows[0].id;

    const selectQuery = `
      SELECT p.*, u.username as author_name, u.avatar_url as author_avatar, 0 as comment_count, false as is_liked
      FROM social_posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    const res = await this.db.query(selectQuery, [newPostId]);
    return this.mapPostEntity(res.rows[0]);
  }

  async addComment(postId: number, userId: string, content: string, parentId?: number) {
    const insertQuery = `
      INSERT INTO social_comments (post_id, user_id, content, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const insertRes = await this.db.query(insertQuery, [postId, userId, content, parentId || null]);
    const newCommentId = insertRes.rows[0].id;

    const selectQuery = `
      SELECT c.*, u.username as author_name, u.avatar_url as author_avatar, false as is_liked
      FROM social_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    const res = await this.db.query(selectQuery, [newCommentId]);
    return this.mapCommentEntity(res.rows[0]);
  }

  async toggleLikePost(userId: string, postId: number): Promise<{ liked: boolean; newCount: number }> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Check if already liked
      const checkQuery = 'SELECT 1 FROM social_likes WHERE user_id = $1 AND post_id = $2';
      const checkRes = await client.query(checkQuery, [userId, postId]);
      let liked = false;

      if (checkRes.rowCount && checkRes.rowCount > 0) {
        // Unlike
        await client.query('DELETE FROM social_likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
        await client.query('UPDATE social_posts SET likes = likes - 1 WHERE id = $1', [postId]);
        liked = false;
      } else {
        // Like
        await client.query('INSERT INTO social_likes (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
        await client.query('UPDATE social_posts SET likes = likes + 1 WHERE id = $1', [postId]);
        liked = true;
      }
      
      // Get new count
      const countRes = await client.query('SELECT likes FROM social_posts WHERE id = $1', [postId]);
      const newCount = countRes.rows[0].likes;

      await client.query('COMMIT');
      return { liked, newCount };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async toggleLikeComment(userId: string, commentId: number): Promise<{ liked: boolean; newCount: number }> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Check if already liked
      const checkQuery = 'SELECT 1 FROM social_likes WHERE user_id = $1 AND comment_id = $2';
      const checkRes = await client.query(checkQuery, [userId, commentId]);
      let liked = false;

      if (checkRes.rowCount && checkRes.rowCount > 0) {
        // Unlike
        await client.query('DELETE FROM social_likes WHERE user_id = $1 AND comment_id = $2', [userId, commentId]);
        await client.query('UPDATE social_comments SET likes = likes - 1 WHERE id = $1', [commentId]);
        liked = false;
      } else {
        // Like
        await client.query('INSERT INTO social_likes (user_id, comment_id) VALUES ($1, $2)', [userId, commentId]);
        await client.query('UPDATE social_comments SET likes = likes + 1 WHERE id = $1', [commentId]);
        liked = true;
      }
      
      // Get new count
      const countRes = await client.query('SELECT likes FROM social_comments WHERE id = $1', [commentId]);
      const newCount = countRes.rows[0].likes;

      await client.query('COMMIT');
      return { liked, newCount };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  // --- Helpers ---

  private mapPostEntity(row: any): SocialPost {
    return {
      id: row.id,
      id_User: String(row.user_id),
      user: row.author_name || 'Unknown',
      avatar: row.author_avatar || '',
      content: row.content,
      likes: row.likes || 0,
      isLiked: row.is_liked || false,
      comments: parseInt(row.comment_count || '0'),
      time: SocialRepository.formatTime(row.created_at),
      createdAt: row.created_at,
      replies: []
    };
  }

  private mapCommentEntity(row: any): any {
    return {
      id: row.id,
      postId: row.post_id,
      parentId: row.parent_id,
      id_User: String(row.user_id),
      user: row.author_name || 'Unknown',
      avatar: row.author_avatar || '',
      content: row.content,
      time: SocialRepository.formatTime(row.created_at),
      createdAt: row.created_at,
      likes: row.likes || 0,
      isLiked: row.is_liked || false,
      replies: []
    };
  }

  private buildCommentTree(flatComments: any[]): Comment[] {
    const tree: Comment[] = [];
    const map = new Map<number, any>();

    // First pass: create map and initialize replies arrays
    flatComments.forEach(c => {
        c.replies = [];
        map.set(c.id, c);
    });

    // Second pass: link parents/children
    flatComments.forEach(c => {
        if (c.parentId) {
            const parent = map.get(c.parentId);
            if (parent) {
                parent.replies.push(c);
            } else {
                // Add to root if parent not found in current set
                tree.push(c);
            }
        } else {
            tree.push(c);
        }
    });

    return tree;
  }

  private static formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}j`;
  }
}
