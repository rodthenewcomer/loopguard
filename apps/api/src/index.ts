import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import metricsRouter from './routes/metrics';
import authRouter from './routes/auth';
import { logger } from './lib/logger';

const PORT = Number(process.env['PORT'] ?? 3001);

const ALLOWED_ORIGINS = [
  'https://loopguard.vercel.app',
  'https://loopguard.dev',
  'https://www.loopguard.dev',
  'http://localhost:3000',   // web dev
  'http://localhost:3001',   // api dev
  'vscode-webview:',         // VS Code webview panel
];

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, extension fetch)
      if (origin === undefined || ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '64kb' }));

// ── Health check ───────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'loopguard-api',
    version: process.env['npm_package_version'] ?? 'unknown',
  });
});

// ── Routes ─────────────────────────────────────────────────────────
// Auth: one-time code exchange (IDE extension sign-in)
app.use('/api/v1/auth', authRouter);
// Metrics: session sync, loop recording, dashboard summary
app.use('/api/v1/metrics', metricsRouter);

// ── 404 handler ────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Error handler ───────────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error({ err: err.message }, 'Unhandled error');
    res.status(500).json({ error: 'Internal server error' });
  },
);

// ── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info({ port: PORT }, '[LoopGuard API] Listening');
  logger.info(
    { supabase: process.env['SUPABASE_URL'] ? 'configured' : 'not configured' },
    '[LoopGuard API] Supabase status',
  );
});
