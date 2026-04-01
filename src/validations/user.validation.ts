import Joi from 'joi';

export const updateRoleSchema = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object().keys({
        role: Joi.string().valid('VIEWER', 'ANALYST', 'ADMIN').required(),
    }),
};

export const updateStatusSchema = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object().keys({
        isActive: Joi.boolean().required(),
    }),
};
