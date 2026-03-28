import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Employee } from '../models/index.js';
import db from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

const JWT_SECRET         = process.env.JWT_SECRET          || 'govpay-access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET  || 'govpay-refresh-secret';
const JWT_EXPIRES_IN     = process.env.JWT_EXPIRES_IN      || '15m';
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// ── Helpers ───────────────────────────────────────────────────────────────────
const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });
    return { accessToken, refreshToken };
};

const saveRefreshToken = (userId, token) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT OR REPLACE INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)')
      .run(userId, token, expiresAt);
};

const deleteRefreshToken = (token) => {
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
};

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, email, role, employeeId } = req.body;

        const existingUser = User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = User.create(username, hashedPassword, email, role, employeeId);

        logger.info(`New user registered: ${username} (role: ${role})`);
        res.status(201).json({ success: true, message: 'User created successfully', userId: result.lastInsertRowid });
    } catch (error) {
        next(error);
    }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = User.findByUsername(username);
        if (!user) {
            logger.warn(`Failed login attempt for username: ${username}`);
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logger.warn(`Wrong password for username: ${username}`);
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        let employeeData = null;
        if (user.employee_id) {
            employeeData = Employee.findById(user.employee_id);
        }

        const payload = { id: user.id, username: user.username, role: user.role, employeeId: user.employee_id };
        const { accessToken, refreshToken } = generateTokens(payload);

        // Persist refresh token
        saveRefreshToken(user.id, refreshToken);

        logger.info(`User logged in: ${username}`);
        res.json({
            success: true,
            token: accessToken,           // kept as 'token' for frontend compat
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                employee: employeeData
            }
        });
    } catch (error) {
        next(error);
    }
});

// ── Refresh Token ─────────────────────────────────────────────────────────────
router.post('/refresh-token', (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ success: false, error: 'Refresh token required' });
        }

        // Check it exists in DB (not revoked)
        const stored = db.prepare('SELECT * FROM refresh_tokens WHERE token = ?').get(refreshToken);
        if (!stored) {
            return res.status(403).json({ success: false, error: 'Invalid or revoked refresh token' });
        }

        // Verify signature
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        // Issue new access token
        const payload = { id: decoded.id, username: decoded.username, role: decoded.role, employeeId: decoded.employeeId };
        const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        logger.info(`Access token refreshed for user ID: ${decoded.id}`);
        res.json({ success: true, token: newAccessToken });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ success: false, error: 'Refresh token expired or invalid. Please log in again.' });
        }
        next(error);
    }
});

// ── Logout ────────────────────────────────────────────────────────────────────
router.post('/logout', (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            deleteRefreshToken(refreshToken);
        }
        logger.info('User logged out');
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
});

// ── Get Current User ──────────────────────────────────────────────────────────
router.get('/me', async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        let employeeData = null;
        if (user.employee_id) {
            employeeData = Employee.findById(user.employee_id);
        }

        res.json({
            success: true,
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            employee: employeeData
        });
    } catch (error) {
        next(error);
    }
});

export default router;
