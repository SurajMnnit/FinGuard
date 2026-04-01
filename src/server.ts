import app from './app';
import { config } from './config/env';
import prisma from './config/prisma';

let server: any;

prisma.$connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        server = app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to database', err);
        process.exit(1);
    });

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: any) => {
    console.error('Unexpected error:', error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});
