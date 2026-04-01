import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { registerUser, loginUser } from '../services/auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, data: user, message: 'User registered successfully' });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({ success: true, token, data: user, message: 'Login successful' });
});
