import { Router } from 'express';
import { create, getAll, getOne, update, remove } from '../controllers/record.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema, getRecordParamsSchema } from '../validations/record.validation';

const router = Router();

router.use(authenticate);

// Viewers can create, view, update, and delete their own records
// Analysts and Admins will be able to see all records via the get route
router.post('/', validate(createRecordSchema), create);
router.get('/', getAll);
router.get('/:id', validate(getRecordParamsSchema), getOne);
router.put('/:id', validate(updateRecordSchema), update);
router.delete('/:id', validate(getRecordParamsSchema), remove);

export default router;
