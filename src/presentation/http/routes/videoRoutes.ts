import { messageController } from "@setup/container/shared/controllers";
import { learnerInstructorAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const videoRoutes=express.Router();



videoRoutes.post(ROUTES.TOKEN,learnerInstructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getVideoCallToken(req,res,next));


export default videoRoutes;