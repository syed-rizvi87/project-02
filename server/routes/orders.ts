import { Router, Request, Response } from 'express';
import { db } from '../db';
import { Order } from '../../src/types/ecommerce';

export const ordersRouter = Router();

// GET /api/orders
ordersRouter.get('/', (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    const orders = db.getOrders(email ? String(email) : undefined);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id
ordersRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders
ordersRouter.post('/', (req: Request, res: Response) => {
  try {
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      shippingMethod, 
      shippingCost, 
      subtotal, 
      discount, 
      tax, 
      total 
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Shopping bag items are required.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, error: 'Valid consignee shipping address is required.' });
    }

    const createdOrder = db.createOrder({
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      shippingMethod: shippingMethod || 'Standard Insured Courier',
      shippingCost: Number(shippingCost || 0),
      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      tax: Number(tax || 0),
      total: Number(total || 0)
    });

    res.status(201).json({ success: true, data: createdOrder });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/status
ordersRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses: Order['status'][] = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
