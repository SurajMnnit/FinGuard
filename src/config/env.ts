import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(5000),
    JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
    JWT_EXPIRES_IN: Joi.string().default('1d'),
    DATABASE_URL: Joi.string().required().description('Database URL required'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    console.error(`Config validation error: ${error.message}`);
}

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwt: {
        secret: envVars.JWT_SECRET || 'fallback_secret',
        expiresIn: envVars.JWT_EXPIRES_IN,
    },
    db: {
        url: envVars.DATABASE_URL,
    },
};
