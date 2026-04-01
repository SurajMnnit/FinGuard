import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { config } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (!(err instanceof ApiError)) {
        if (err.name === 'PrismaClientKnownRequestError') {
            if (err.code === 'P2002') {
                statusCode = 409;
                message = 'Resource already exists';
            } else {
                statusCode = 400;
                message = 'Database error';
            }
        } else {
            statusCode = 500;
            message = err.message || 'Internal Server Error';
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    });
};
