import { Router, Request, Response } from 'express';
import { db } from '../db';

export const couponsRouter = Router();

// GET /api/coupons
couponsRouter.get('/', (req: Request, res: Response) => {
  try {
    const coupons = db.getCoupons();
    res.json({ success: true, data: coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/coupons/validate
couponsRouter.post('/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Promo code is required.' });
    }

    const result = db.validateCoupon(code, Number(subtotal || 0));
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      data: {
        coupon: result.coupon,
        discount: result.discount,
        message: result.message
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
