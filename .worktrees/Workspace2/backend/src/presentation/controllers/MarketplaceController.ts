import { Request, Response } from 'express';
import crypto from 'crypto';

export class Product {
  constructor(
    public readonly id: string,
    public readonly sellerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price: number,
    public readonly category: string,
    public readonly imageUrl: string | null,
    public readonly stock: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date
  ) {}
}

export class MarketplaceController {
  // In a real implementation, we would inject a ProductRepository
  // For this template, we'll simulate the behavior

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Mocked products
      const products: Product[] = [
        new Product(
          crypto.randomUUID(),
          'seller_1',
          'Course: Blockchain 101',
          'Learn the basics of blockchain technology.',
          10,
          'Education',
          'https://example.com/course.jpg',
          100,
          true,
          new Date()
        )
      ];

      res.json({
        success: true,
        products: products.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          imageUrl: p.imageUrl,
          stock: p.stock
        })),
        total: products.length
      });
    } catch (error) {
      console.error('[MarketplaceController] Get products failed:', error);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, price, category, imageUrl, stock } = req.body;
      const sellerId = (req as any).user.id;

      const product = new Product(
        crypto.randomUUID(),
        sellerId,
        title,
        description,
        price,
        category,
        imageUrl,
        stock,
        true,
        new Date()
      );

      res.status(201).json({
        success: true,
        product
      });
    } catch (error) {
      console.error('[MarketplaceController] Create product failed:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  };
}
