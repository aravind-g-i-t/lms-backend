import express from 'express';
import userAuthRouter from './userAuthRouter';
import adminRouter from './adminRouter';
import learnerRouter from './learnerRouter';
const router = express.Router();

router.use('/auth',userAuthRouter)
router.use('/admin',adminRouter);
router.use('/learner',learnerRouter);


export default router;