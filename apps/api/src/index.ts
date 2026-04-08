import express from 'express';
import cors from 'cors';
import metricsRouter from './routes/metrics';
import authRouter from './routes/auth';

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
  res.json({ ok: true, service: 'loopguard-api', version: '2.8.1' });
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
    console.error('[LoopGuard API] Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  },
);

// ── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[LoopGuard API] Listening on :${PORT}`);
  console.log(`[LoopGuard API] Supabase: ${process.env['SUPABASE_URL'] ? '✓ configured' : '✗ not configured'}`);
});
