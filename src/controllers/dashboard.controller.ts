import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';
import { 
    getDashboardAnalytics, 
    getSummary, 
    getCategoryTotals, 
    getMonthlyTrends,
    getRecentTransactions
} from '../services/dashboard.service';

export const getDashboardData = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const role = req.user.role;
    const data = await getDashboardAnalytics(userId, role);
    res.status(200).json({ success: true, data });
});

export const getSummaryData = catchAsync(async (req: AuthRequest, res: Response) => {
    const data = await getSummary(req.user.id, req.user.role);
    res.status(200).json({ success: true, data });
});

export const getCategoryData = catchAsync(async (req: AuthRequest, res: Response) => {
    const data = await getCategoryTotals(req.user.id, req.user.role);
    res.status(200).json({ success: true, data });
});

export const getTrendsData = catchAsync(async (req: AuthRequest, res: Response) => {
    const data = await getMonthlyTrends(req.user.id, req.user.role);
    res.status(200).json({ success: true, data });
});

export const getRecentData = catchAsync(async (req: AuthRequest, res: Response) => {
    const data = await getRecentTransactions(req.user.id, req.user.role);
    res.status(200).json({ success: true, data });
});
