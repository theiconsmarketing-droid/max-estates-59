import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';

const app = express();
const PORT: number = parseInt(process.env.PORT ?? '8080', 10);

// ── Security headers (replaces .htaccess Header directives) ──
app.use(
  helmet({
    contentSecurityPolicy: false, // CSP disabled — page uses inline scripts/Google Tag Manager
    crossOriginEmbedderPolicy: false,
  })
);

// ── Gzip compression (replaces .htaccess mod_deflate) ──
app.use(compression());

// ── HTTPS redirect via reverse-proxy header (Hostinger sets X-Forwarded-Proto) ──
app.use((req: Request, res: Response, next: NextFunction): void => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    res.redirect(301, `https://${req.headers.host ?? ''}${req.url}`);
    return;
  }
  next();
});

// ── Static files with cache-control headers ──
// Images: 1 year
app.use(
  '/assets/images',
  express.static(path.join(__dirname, '..', 'assets', 'images'), {
    maxAge: '1y',
    immutable: true,
  })
);

// CSS & JS: 1 month
app.use(
  '/assets/css',
  express.static(path.join(__dirname, '..', 'assets', 'css'), {
    maxAge: '30d',
  })
);
app.use(
  '/assets/js',
  express.static(path.join(__dirname, '..', 'assets', 'js'), {
    maxAge: '30d',
  })
);

// Everything else at root (robots.txt, etc.): 2 days
app.use(
  express.static(path.join(__dirname, '..'), {
    maxAge: '2d',
  })
);

// ── Health check (for Hostinger uptime monitoring) ──
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', service: 'max-estates-59' });
});

// ── Explicit page routes ──
app.get('/thank-you', (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '..', 'thank-you.html'));
});

app.get('/privacy-policy', (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '..', 'privacy-policy.html'));
});

// ── SPA fallback: all unmatched GET requests → index.html ──
app.get('/{*path}', (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── Start server ──
app.listen(PORT, (): void => {
  console.log(`[Max Estates 59] Server running on port ${PORT}`);
  console.log(`[Max Estates 59] Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

export default app;
