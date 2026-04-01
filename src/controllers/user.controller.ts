import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { getAllUsers, updateUserRole, updateUserStatus } from '../services/user.service';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.status(200).json({ success: true, data: users });
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    const { role } = req.body;
    const user = await updateUserRole(userId, role);
    res.status(200).json({ success: true, data: user, message: 'User role updated' });
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    const { isActive } = req.body;
    const user = await updateUserStatus(userId, isActive);
    res.status(200).json({ success: true, data: user, message: 'User status updated' });
});
