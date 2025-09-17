import { Request, Response, NextFunction } from "express";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { MESSAGES } from "shared/constants/messages";



export const createAdminAuthMiddleware = (tokenService: ITokenService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
      
      const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log('token in middleware',token);
    

    let decoded:any

    try{
        decoded  = await tokenService.verifyAccessToken(token);
    }catch(err){
        return res.status(401).json({ message: MESSAGES.INVALID_TOKEN });
    }
    (req as any).user = decoded;
    next();
  };
};
