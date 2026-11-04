import { Router, Request, Response } from 'express';
import { db } from '../db';

export const productsRouter = Router();

// GET /api/products
productsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, inStock, sort } = req.query;

    const products = db.getProducts({
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStock === 'true',
      sort: sort ? String(sort) : undefined
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id
productsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products (Admin)
productsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, price, category, categorySlug, stock, materials, care, origin, images, colors, sizes } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title, price, and category are required fields.'
      });
    }

    const created = db.addProduct({
      title,
      subtitle: subtitle || '',
      description: description || '',
      price: Number(price),
      category,
      categorySlug: categorySlug || 'apparel',
      stock: Number(stock || 10),
      materials: materials || 'European Natural Fibres',
      care: care || 'Specialist clean',
      origin: origin || 'Milan, Italy',
      images: images || ['/src/assets/images/hero_luxury_atelier_1793815699829.jpg'],
      colors: colors || [{ name: 'Oatmeal', hex: '#D6C8B5', bgClass: 'bg-[#D6C8B5]' }],
      sizes: sizes || ['S', 'M', 'L'],
      isNew: true
    });

    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/products/:id/stock
productsRouter.patch('/:id/stock', (req: Request, res: Response) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || isNaN(Number(stock))) {
      return res.status(400).json({ success: false, error: 'Valid stock number is required.' });
    }

    const updated = db.updateProductStock(req.params.id, Number(stock));
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products/:id/reviews
productsRouter.post('/:id/reviews', (req: Request, res: Response) => {
  try {
    const { author, location, rating, title, comment } = req.body;
    if (!author || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Author, rating, title, and comment are required.'
      });
    }

    const result = db.addReviewToProduct(req.params.id, {
      author,
      location: location || 'Verified Patron',
      rating: Number(rating),
      verified: true,
      title,
      comment
    });

    if (!result) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
