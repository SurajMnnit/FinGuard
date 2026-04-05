import { Router } from 'express';
import { 
    getDashboardData, 
    getSummaryData, 
    getCategoryData, 
    getTrendsData,
    getRecentData 
} from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

// Dashboard views (Restricted to Analysts and Admins as per requirements)
router.get('/', authorize('ANALYST', 'ADMIN'), getDashboardData);

// Specific analytics (Restricted to Analysts and Admins as per requirements)
router.get('/summary', authorize('ANALYST', 'ADMIN'), getSummaryData);
router.get('/category', authorize('ANALYST', 'ADMIN'), getCategoryData);
router.get('/trends', authorize('ANALYST', 'ADMIN'), getTrendsData);
router.get('/recent', authorize('ANALYST', 'ADMIN'), getRecentData);

export default router;
