import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

/**
 * Create a new financial record
 * @param userId - ID of the user performing the action
 * @param role - Role of the user performing the action
 * @param data - Record data
 * @returns The created record
 */
export const createRecord = async (userId: number, role: string, data: any) => {
    const { userId: targetUserId, ...recordData } = data;
    
    // RBAC: Only Admin can specify a different userId for which to create a record 
    // This allows admins to add records on behalf of other users.
    const finalUserId = (role === 'ADMIN' && targetUserId) ? targetUserId : userId;

    return prisma.record.create({
        data: {
            ...recordData,
            date: new Date(recordData.date),
            userId: finalUserId,
        },
    });
};

export const getRecords = async (userId: number, role: string, filters: any) => {
    const { 
        page = 1, 
        limit = 10, 
        startDate, 
        endDate, 
        category, 
        type, 
        search,
        userId: targetUserId
    } = filters;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const where: any = {};

    // Role-based scoping: VIEWERS can only see their own records.
    // ADMINS and ANALYSTS can see everything and can optionally filter by targetUserId.
    if (role !== 'ADMIN' && role !== 'ANALYST') {
        where.userId = userId;
    } else if (targetUserId) {
        where.userId = parseInt(targetUserId, 10);
    }

    // Filtering
    if (type) where.type = type;
    if (category) where.category = category;
    
    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
    }

    // Search (by category or description)
    if (search) {
        where.OR = [
            { category: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [records, total] = await Promise.all([
        prisma.record.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { date: 'desc' },
            skip,
            take,
        }),
        prisma.record.count({ where }),
    ]);

    return {
        records,
        pagination: {
            total,
            page: parseInt(page, 10),
            limit: take,
            totalPages: Math.ceil(total / take),
        },
    };
};

export const getRecordById = async (userId: number, role: string, recordId: number) => {
    const record = await prisma.record.findUnique({
        where: { id: recordId },
        include: { user: { select: { id: true, name: true, email: true } } },
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
    const record = await prisma.record.findUnique({ where: { id: recordId } });
    if (!record) {
        throw new ApiError(404, 'Record not found');
    }

    // Ownership Security: Users can ONLY access their own records unless they are ADMIN
    if (record.userId !== userId && role !== 'ADMIN') {
        throw new ApiError(403, 'Forbidden: You do not have permission to modify this record');
    }

    const { userId: targetUserId, ...updateData } = data;
    
    // Parse date if updated
    if (updateData.date) {
        updateData.date = new Date(updateData.date);
    }

    const finalData = { ...updateData };
    // Only Admin can reassign ownership
    if (role === 'ADMIN' && targetUserId) {
        finalData.userId = targetUserId;
    }

    return prisma.record.update({
        where: { id: recordId },
        data: finalData,
    });
};


export const deleteRecord = async (userId: number, role: string, recordId: number) => {
    const record = await prisma.record.findUnique({ where: { id: recordId } });
    if (!record) {
        throw new ApiError(404, 'Record not found');
    }

    // Ownership Security: Users can ONLY delete their own records unless they are ADMIN
    if (record.userId !== userId && role !== 'ADMIN') {
        throw new ApiError(403, 'Forbidden: You do not have permission to delete this record');
    }

    await prisma.record.delete({
        where: { id: recordId },
    });

    return { message: 'Record deleted successfully' };
};
