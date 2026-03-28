import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { securityHeaders } from './middleware/security.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import logger, { morganStream } from './config/logger.js';

import authRoutes        from './routes/auth.js';
import employeeRoutes    from './routes/employees.js';
import payrollRoutes     from './routes/payroll.js';
import payrollRulesRoutes from './routes/payrollRules.js';
import leaveRoutes       from './routes/leaves.js';
import analyticsRoutes   from './routes/analytics.js';

// Load environment variables
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(securityHeaders);

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HTTP request logging via Morgan → Winston ─────────────────────────────────
app.use(morgan('combined', { stream: morganStream }));

// ── General rate limiter ──────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          authLimiter, authRoutes);   // stricter limit on auth
app.use('/api/employees',     employeeRoutes);
app.use('/api/payroll',       payrollRoutes);
app.use('/api/payroll-rules', payrollRulesRoutes);
app.use('/api/leaves',        leaveRoutes);
app.use('/api/analytics',     analyticsRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status:  'ok',
        message: 'GovPay API is running',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    const status  = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`[${req.method} ${req.path}] ${status} - ${message}`, { stack: err.stack });

    res.status(status).json({
        success: false,
        error:   message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    logger.info(`\n🚀 GovPay Backend v2.0 — http://localhost:${PORT}`);
    logger.info('✅ Security: Helmet + Rate Limiter active');
    logger.info('✅ Logging: Winston + Morgan active');
    logger.info('📡 Routes: auth | employees | payroll | payroll-rules | leaves | analytics');
});
