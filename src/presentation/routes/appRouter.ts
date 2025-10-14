import express from 'express';
import userAuthRouter from './userAuthRouter';
import adminRouter from './adminRouter';
import learnerRouter from './learnerRouter';
import businessRouter from './businessRoutes';
import instructorRouter from './instructotRoutes';
import { ROUTES } from 'shared/constants/routes';
import s3Router from './s3Routes';
const router = express.Router();

router.use(ROUTES.AUTH,userAuthRouter)
router.use(ROUTES.ADMIN,adminRouter);
router.use(ROUTES.LEARNER,learnerRouter);
router.use(ROUTES.INSTRUCTOR,instructorRouter);
router.use(ROUTES.BUSINESS,businessRouter);
router.use(ROUTES.S3,s3Router);


export default router;