import { messageController } from "@setup/container/message";
import { learnerInstructorAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
const videoRoutes=express.Router();



videoRoutes.post("/token",learnerInstructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getVideoCallToken(req,res,next));


export default videoRoutes;