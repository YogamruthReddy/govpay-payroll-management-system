import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure logs directory exists
const logsDir = join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Error logs to file
        new winston.transports.File({
            filename: join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Combined logs to file
        new winston.transports.File({
            filename: join(logsDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});

// Color console output in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize({ all: true }),
            timestamp({ format: 'HH:mm:ss' }),
            printf(({ level, message, timestamp, stack }) => {
                return `${timestamp} ${level}: ${stack || message}`;
            })
        )
    }));
}

// Morgan stream for HTTP request logging
export const morganStream = {
    write: (message) => logger.http(message.trim()),
};

export default logger;
