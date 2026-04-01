import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recordRoutes from './routes/record.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { config } from './config/env';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (config.env === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Swagger Docs setup
try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.log('Swagger document not found, skipping api-docs...');
}

// Health check
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'FinGuard API is running' });
});

// Unknown route
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
