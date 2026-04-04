import Joi from 'joi';

export const createRecordSchema = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
        type: Joi.string().valid('INCOME', 'EXPENSE').required(),
        category: Joi.string().required(),
        date: Joi.date().iso().required(),
        description: Joi.string().optional().allow(''),
        userId: Joi.number().integer().optional(), // Allow Admin to set userId
    }),
};

export const getRecordsQuerySchema = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        type: Joi.string().valid('INCOME', 'EXPENSE'),
        category: Joi.string(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        search: Joi.string().allow(''),
    }),
};

export const updateRecordSchema = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object().keys({
        amount: Joi.number(),
        type: Joi.string().valid('INCOME', 'EXPENSE'),
        category: Joi.string(),
        date: Joi.date().iso(),
        description: Joi.string().allow(''),
        userId: Joi.number().integer(),
    }).min(1),
};

export const getRecordParamsSchema = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
};

