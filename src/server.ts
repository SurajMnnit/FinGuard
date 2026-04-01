import { Server } from 'http';
import app from './app';
import { config } from './config/env';
import prisma from './config/prisma';

let server: Server | null = null;
let isShutDown = false;

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
    if (isShutDown) return;
    isShutDown = true;

    if (server) {
        server.close(() => {
            console.log('Server closed');
            prisma.$disconnect()
                .catch((e: unknown) => console.error('Error during Prisma disconnect:', e))
                .finally(() => process.exit(1));
        });
    } else {
        prisma.$disconnect()
            .catch((e: unknown) => console.error('Error during Prisma disconnect:', e))
            .finally(() => process.exit(1));
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error('Unexpected error:', error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (isShutDown) return;
    isShutDown = true;

    if (server) {
        server.close(() => {
            console.log('Server closed');
            prisma.$disconnect()
                .catch((e: unknown) => console.error('Error during Prisma disconnect:', e))
                .finally(() => process.exit(0));
        });
    } else {
        prisma.$disconnect()
            .catch((e: unknown) => console.error('Error during Prisma disconnect:', e))
            .finally(() => process.exit(0));
    }
});
