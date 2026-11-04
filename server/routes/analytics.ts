import { Router, Request, Response } from 'express';
import { db } from '../db';

export const analyticsRouter = Router();

// GET /api/analytics
analyticsRouter.get('/', (req: Request, res: Response) => {
  try {
    const data = db.getAnalytics();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
