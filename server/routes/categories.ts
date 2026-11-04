import { Router, Request, Response } from 'express';
import { db } from '../db';

export const categoriesRouter = Router();

// GET /api/categories
categoriesRouter.get('/', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
