import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';
import {
    createRecord,
    getRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
} from '../services/record.service';

export const create = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const role = req.user.role;
    const record = await createRecord(userId, role, req.body);
    res.status(201).json({ success: true, data: record });
});

export const getAll = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const role = req.user.role;
    const records = await getRecords(userId, role, req.query);
    res.status(200).json({ success: true, ...records });
});

export const getOne = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const role = req.user.role;
    const recordId = parseInt(req.params.id, 10);
    const record = await getRecordById(userId, role, recordId);
    res.status(200).json({ success: true, data: record });
});

export const update = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const role = req.user.role;
    const recordId = parseInt(req.params.id, 10);
    const record = await updateRecord(userId, role, recordId, req.body);
    res.status(200).json({ success: true, data: record, message: 'Record updated' });
});

export const remove = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const role = req.user.role;
    const recordId = parseInt(req.params.id, 10);
    await deleteRecord(userId, role, recordId);
    res.status(200).json({ success: true, message: 'Record deleted' });
});
