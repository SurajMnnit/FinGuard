import Joi from 'joi';

export const createRecordSchema = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
        type: Joi.string().valid('INCOME', 'EXPENSE').required(),
        category: Joi.string().required(),
        date: Joi.date().iso().required(),
        description: Joi.string().optional().allow(''),
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
    }).min(1),
};

export const getRecordParamsSchema = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
};
