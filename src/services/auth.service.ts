import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { config } from '../config/env';

export const registerUser = async (data: any) => {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ApiError(409, 'Email already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // First user registration gets ADMIN automatically just for convenience in this assignment, 
    // or we can strictly enforce VIEWER setup. Let's make it strict VIEWER and require DB intervention or 
    // special route to make an admin. Actually, if count is 0, make it ADMIN.
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'VIEWER';

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role,
        },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const loginUser = async (data: any) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
        throw new ApiError(401, 'Incorrect email or password, or account disabled');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Incorrect email or password');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
