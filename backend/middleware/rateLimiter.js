import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

// Strict limiter for auth routes (login/register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 requests per 15 min per IP
    message: {
        success: false,
        error: 'Too many login attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
        res.status(options.statusCode).json(options.message);
    },
});

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120, // 120 requests per minute
    message: {
        success: false,
        error: 'Too many requests. Please slow down.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
