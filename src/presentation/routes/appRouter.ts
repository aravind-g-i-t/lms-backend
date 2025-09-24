import express from 'express';
import userAuthRouter from './userAuthRouter';
import adminRouter from './adminRouter';
import learnerRouter from './learnerRouter';
import businessRouter from './businessRoutes';
import instructorRouter from './instructotRoutes';
const router = express.Router();

router.use('/auth',userAuthRouter)
router.use('/admin',adminRouter);
router.use('/learner',learnerRouter);
router.use('/instructor',instructorRouter);
router.use('/business',businessRouter);

export default router;