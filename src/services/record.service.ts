import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export const createRecord = async (userId: number, data: any) => {
    return prisma.record.create({
        data: {
            ...data,
            date: new Date(data.date),
            userId,
        },
    });
};

export const getRecords = async (userId: number, role: string) => {
    if (role === 'ADMIN' || role === 'ANALYST') {
        return prisma.record.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { date: 'desc' },
        });
    }

    return prisma.record.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
};

export const getRecordById = async (userId: number, role: string, recordId: number) => {
    const record = await prisma.record.findUnique({
        where: { id: recordId },
    });

    if (!record) {
        throw new ApiError(404, 'Record not found');
    }

    if (record.userId !== userId && role !== 'ADMIN' && role !== 'ANALYST') {
        throw new ApiError(403, 'Forbidden');
    }

    return record;
};

export const updateRecord = async (userId: number, role: string, recordId: number, data: any) => {
    const record = await getRecordById(userId, role, recordId);

    // If we want to allow updating date, we must parse it
    const updateData = { ...data };
    if (updateData.date) {
        updateData.date = new Date(updateData.date);
    }

    return prisma.record.update({
        where: { id: record.id },
        data: updateData,
    });
};

export const deleteRecord = async (userId: number, role: string, recordId: number) => {
    const record = await getRecordById(userId, role, recordId);

    await prisma.record.delete({
        where: { id: record.id },
    });

    return { message: 'Record deleted successfully' };
};
