import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'govpay-access-secret';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        logger.warn(`Invalid token attempt: ${error.message}`);
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

export const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            logger.warn(`Role access denied: user ${req.user.username} (${req.user.role}) tried to access [${allowedRoles.join(',')}] resource`);
            return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};
