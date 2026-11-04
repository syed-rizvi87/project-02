import { Router, Request, Response } from 'express';
import { db } from '../db';

export const customerRouter = Router();

// GET /api/customer
customerRouter.get('/', (req: Request, res: Response) => {
  try {
    const customer = db.getCustomer();
    res.json({ success: true, data: customer });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/customer
customerRouter.put('/', (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const updated = db.updateCustomer({ name, email, phone });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/customer/addresses
customerRouter.post('/addresses', (req: Request, res: Response) => {
  try {
    const { title, fullName, phone, street, apartment, city, state, postalCode, country, isDefault } = req.body;

    if (!fullName || !street || !city || !postalCode) {
      return res.status(400).json({
        success: false,
        error: 'Full name, street, city, and postal code are required.'
      });
    }

    const newAddress = db.addAddress({
      title: title || 'Saved Destination',
      fullName,
      phone: phone || '',
      street,
      apartment,
      city,
      state: state || '',
      postalCode,
      country: country || 'United States',
      isDefault: Boolean(isDefault)
    });

    res.status(201).json({ success: true, data: newAddress });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/customer/addresses/:id
customerRouter.delete('/addresses/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteAddress(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Address not found.' });
    }
    res.json({ success: true, message: 'Address removed successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/customer/addresses/:id/default
customerRouter.patch('/addresses/:id/default', (req: Request, res: Response) => {
  try {
    const success = db.setDefaultAddress(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Address not found.' });
    }
    res.json({ success: true, message: 'Default address updated.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
