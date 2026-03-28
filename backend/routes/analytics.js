import express from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Full dashboard stats (Admin + Officer) ────────────────────────────────────
router.get('/dashboard', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const stats            = AnalyticsService.getGlobalStats();
        const rawPayrollTrend  = AnalyticsService.getMonthlyPayrollTrend();
        const payrollTrend     = rawPayrollTrend.map(pt => ({
            name:   MONTH_NAMES[pt.month - 1] || 'N/A',
            amount: pt.total_amount
        }));
        const departmentStats  = AnalyticsService.getDepartmentStats();
        const leaveTrends      = AnalyticsService.getLeaveTrends();

        res.json({ success: true, stats, payrollTrend, departmentStats, leaveTrends });
    } catch (error) {
        next(error);
    }
});

// ── Top 5 earners (Admin + Officer) ──────────────────────────────────────────
router.get('/top-earners', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const topEarners = AnalyticsService.getTopEarners();
        res.json({ success: true, topEarners });
    } catch (error) {
        next(error);
    }
});

// ── Salary anomalies (Admin only) ─────────────────────────────────────────────
router.get('/anomalies', authMiddleware, roleMiddleware('ADMIN'), (req, res, next) => {
    try {
        const anomalies = AnalyticsService.getSalaryAnomalies();
        res.json({ success: true, anomalies });
    } catch (error) {
        next(error);
    }
});

// ── Leave analytics (Admin + Officer) ─────────────────────────────────────────
router.get('/leave-analytics', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const leaveAnalytics = AnalyticsService.getLeaveAnalytics();
        res.json({ success: true, ...leaveAnalytics });
    } catch (error) {
        next(error);
    }
});

export default router;
