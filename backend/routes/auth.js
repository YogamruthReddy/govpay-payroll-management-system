import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Employee } from '../models/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role, employeeId } = req.body;

        // Check if user exists
        const existingUser = User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = User.create(username, hashedPassword, email, role, employeeId);

        res.status(201).json({
            message: 'User created successfully',
            userId: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Get employee data if exists
        let employeeData = null;
        if (user.employee_id) {
            employeeData = Employee.findById(user.employee_id);
        }

        // Generate token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
                employeeId: user.employee_id
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                employee: employeeData
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let employeeData = null;
        if (user.employee_id) {
            employeeData = Employee.findById(user.employee_id);
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            employee: employeeData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
