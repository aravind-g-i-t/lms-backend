import { Request, Response, NextFunction } from "express";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { MESSAGES } from "shared/constants/messages";
import { IAuthorizationService } from "@domain/interfaces/IAuthorizationService";
import { STATUS_CODES } from "shared/constants/httpStatus";



export const createAuthMiddleware = (tokenService: ITokenService,authorizationService:IAuthorizationService) => {
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
    const isActive = await authorizationService.checkUserActive(decoded.id, decoded.role);
    if (!isActive) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ message: MESSAGES.BLOCKED });
    }

    (req as any).user = decoded;
    next();
  };
};
