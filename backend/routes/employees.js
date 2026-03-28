import express from 'express';
import { Employee, ServiceHistory } from '../models/index.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all employees (Admin/Officer only)
router.get('/', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res) => {
    try {
        const employees = Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get employee by ID
router.get('/:id', authMiddleware, (req, res) => {
    try {
        const employee = Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create employee (Admin only)
router.post('/', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
    try {
        const { name, email, department, position, grade, joinDate } = req.body;
        const result = Employee.create(name, email, department, position, grade, joinDate);
        res.status(201).json({
            message: 'Employee created successfully',
            employeeId: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update employee (Admin only)
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
    try {
        const result = Employee.update(req.params.id, req.body);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete employee (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
    try {
        const result = Employee.delete(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get employee service history
router.get('/:id/service-history', authMiddleware, (req, res) => {
    try {
        const history = ServiceHistory.findByEmployee(req.params.id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add service history event (Admin only)
router.post('/:id/service-history', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
    try {
        const { eventType, title, description, eventDate } = req.body;
        const result = ServiceHistory.create(req.params.id, eventType, title, description, eventDate);
        res.status(201).json({
            message: 'Service history event added',
            eventId: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
