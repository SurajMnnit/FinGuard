import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { config } from '../config/env';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Unauthorized');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.secret) as { id: number; role: string };

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        if (!user.isActive) {
            throw new ApiError(403, 'User account is deactivated');
        }

        req.user = user;
        next();
    } catch (err) {
        next(new ApiError(401, 'Unauthorized or invalid token'));
    }
};
