import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });
    return users;
};

export const updateUserRole = async (userId: number, role: 'VIEWER' | 'ANALYST' | 'ADMIN') => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
        },
    });

    return updatedUser;
};

export const updateUserStatus = async (userId: number, isActive: boolean) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
        },
    });

    return updatedUser;
};
