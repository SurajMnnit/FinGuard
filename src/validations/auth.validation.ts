import Joi from 'joi';

export const registerSchema = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        name: Joi.string().required(),
    }),
};

export const loginSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};
