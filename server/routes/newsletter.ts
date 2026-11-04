import { Router, Request, Response } from 'express';
import { db } from '../db';

export const newsletterRouter = Router();

// POST /api/newsletter
newsletterRouter.post('/', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address required.' });
    }

    const result = db.subscribeNewsletter(email);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
