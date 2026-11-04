import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { productsRouter } from './server/routes/products';
import { categoriesRouter } from './server/routes/categories';
import { ordersRouter } from './server/routes/orders';
import { couponsRouter } from './server/routes/coupons';
import { customerRouter } from './server/routes/customer';
import { analyticsRouter } from './server/routes/analytics';
import { newsletterRouter } from './server/routes/newsletter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Health probe
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AURA Atelier Backend API', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/coupons', couponsRouter);
  app.use('/api/customer', customerRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/newsletter', newsletterRouter);

  // Vite Integration (SPA Middleware in dev, Static Assets in production)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AURA Atelier API] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
