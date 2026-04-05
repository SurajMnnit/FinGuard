import { Router } from 'express';
import { create, getAll, getOne, update, remove } from '../controllers/record.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createRecordSchema,
    updateRecordSchema,
    getRecordParamsSchema,
    getRecordsQuerySchema,
} from '../validations/record.validation';

const router = Router();

router.use(authenticate);

// Everyone authenticated can get records (access scoping is handled in the service)
router.get('/', validate(getRecordsQuerySchema), getAll);
router.get('/:id', validate(getRecordParamsSchema), getOne);

// Only Admins can modify records (Viewers and Analysts are read-only as per requirements)
router.post('/', authorize('ADMIN'), validate(createRecordSchema), create);
router.put('/:id', authorize('ADMIN'), validate(updateRecordSchema), update);
router.delete('/:id', authorize('ADMIN'), validate(getRecordParamsSchema), remove);

export default router;

