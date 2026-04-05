import { Router } from 'express';
import { getUsers, updateRole, updateStatus } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateRoleSchema, updateStatusSchema } from '../validations/user.validation';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', getUsers);
router.put('/:id/role', validate(updateRoleSchema), updateRole);
router.put('/:id/status', validate(updateStatusSchema), updateStatus);

export default router;
