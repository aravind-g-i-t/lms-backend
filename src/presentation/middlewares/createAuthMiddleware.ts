import { Request, Response, NextFunction } from "express";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { MESSAGES } from "shared/constants/messages";
import { IAuthorizationService } from "@domain/interfaces/IAuthorizationService";
import { STATUS_CODES } from "shared/constants/httpStatus";

export interface AuthenticatedRequest extends Request{
  user?:{
    id:string;
    role:string;
  }
}

interface DecodedToken {
  id: string;
  role: string;
  exp?: number;
  iat?: number;
}



export const createAuthMiddleware = (tokenService: ITokenService,authorizationService:IAuthorizationService) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    let decoded:DecodedToken

    try{
        decoded  = await tokenService.verifyAccessToken(token);
    }catch{
        return res.status(401).json({ message: MESSAGES.INVALID_TOKEN });
    }
    
    if(decoded.role!=="admin"){
      const isActive = await authorizationService.checkUserActive(decoded.id, decoded.role);
      if (!isActive) {
        return res.status(STATUS_CODES.FORBIDDEN).json({ message: MESSAGES.BLOCKED });
      }

    }
    
    
    req.user = {
      id:decoded.id,
      role:decoded.role
    }
    next();
  };
};
