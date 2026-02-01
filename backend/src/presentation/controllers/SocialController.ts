import { Request, Response } from 'express';
import { SocialRepository } from '../../infrastructure/repositories/SocialRepository';

export class SocialController {
  
  constructor(private socialRepository: SocialRepository) {}

  // Get all posts
  public getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      // Optional: if user is logged in, pass their ID to check 'isLiked'
      const user = (req as any).user;
      const currentUserId = user ? user.id : undefined;

      const posts = await this.socialRepository.getAllPosts(currentUserId);
      res.status(200).json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Get posts by user
  public getUserPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = (req as any).user;
      const currentUserId = user ? user.id : undefined;

      const posts = await this.socialRepository.getUserPosts(userId, currentUserId ? String(currentUserId) : undefined);
      res.status(200).json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Toggle Like Post
  public toggleLikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const user = (req as any).user;

        if (!user) {
             res.status(401).json({ error: 'Unauthorized' });
             return;
        }

        const result = await this.socialRepository.toggleLikePost(String(user.id), Number(postId));

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Toggle Like Comment
  public toggleLikeComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId } = req.params;
        const user = (req as any).user;
        
        if (!user) {
             res.status(401).json({ error: 'Unauthorized' });
             return;
        }

        const result = await this.socialRepository.toggleLikeComment(String(user.id), Number(commentId));

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error toggling comment like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Add Comment (Supports nesting)
  public addComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { postId } = req.params;
      const { content, parentId } = req.body;
      const user = (req as any).user;

      if (!content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const comment = await this.socialRepository.addComment(
        Number(postId),
        String(user.id),
        content,
        parentId ? Number(parentId) : undefined
      );

      res.status(201).json({
        success: true,
        data: comment
      });

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Create a new post
  public createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content } = req.body;
      const user = (req as any).user;

      if (!content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const post = await this.socialRepository.createPost(
        String(user.id),
        content
      );

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
