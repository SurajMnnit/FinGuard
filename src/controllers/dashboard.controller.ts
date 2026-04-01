import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';
import { getDashboardAnalytics } from '../services/dashboard.service';

export const getDashboardData = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const role = req.user.role;
    const data = await getDashboardAnalytics(userId, role);
    res.status(200).json({ success: true, data });
});
