import express from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get full dashboard statistics
router.get('/dashboard', authMiddleware, roleMiddleware('ADMIN'), (req, res) => {
    try {
        const stats = AnalyticsService.getGlobalStats();
        
        // Month names mapping
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const rawPayrollTrend = AnalyticsService.getMonthlyPayrollTrend();
        const payrollTrend = rawPayrollTrend.map(pt => ({
            name: monthNames[pt.month - 1] || 'Unknown',
            amount: pt.total_amount
        }));

        const departmentStats = AnalyticsService.getDepartmentStats();
        const leaveTrends = AnalyticsService.getLeaveTrends();

        res.json({
            stats,
            payrollTrend,
            departmentStats,
            leaveTrends
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
