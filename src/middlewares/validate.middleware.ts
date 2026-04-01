import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = Object.keys(schema).reduce((acc: any, key) => {
        acc[key] = schema[key];
        return acc;
    }, {});

    const object = Object.keys(validSchema).reduce((acc: any, key) => {
        acc[key] = (req as any)[key];
        return acc;
    }, {});

    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(400, errorMessage));
    }

    Object.assign(req, value);
    return next();
};
