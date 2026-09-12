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

// ── Parse JSON & URL-encoded request bodies ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// ── TeleCRM Proxy Endpoint (reads TELECRM_API_KEY & TELECRM_ENTERPRISE_ID env vars) ──
app.post('/api/telecrm', async (req: Request, res: Response): Promise<void> => {
  const enterpriseId = process.env.TELECRM_ENTERPRISE_ID || '6926c7d748e8b3e9aa584f34';
  const apiKey = process.env.TELECRM_API_KEY || '';

  try {
    const telecrmUrl = `https://next-api.telecrm.in/enterprise/${enterpriseId}/autoupdatelead`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(telecrmUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[TeleCRM Proxy Error]:', error);
    res.status(500).json({ error: 'Failed to forward to TeleCRM' });
  }
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
