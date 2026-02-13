import jwt , {SignOptions} from 'jsonwebtoken';
import { ITokenService } from '@domain/interfaces/ITokenService';
import { AppError } from 'shared/errors/AppError';
import { MESSAGES } from 'shared/constants/messages';
import { STATUS_CODES } from 'shared/constants/httpStatus';
import { logger } from '@infrastructure/logging/Logger';


const accessTokenMaxAge = (process.env.ACCESS_TOKEN_MAX_AGE || "15m") as SignOptions["expiresIn"];
const refreshTokenMaxAge = (process.env.REFRESH_TOKEN_MAX_AGE || "7d") as SignOptions["expiresIn"];




export class TokenService implements ITokenService {
    constructor(
        private readonly accessSecret: string = process.env.JWT_ACCESS_SECRET || 'tempaccesssecret',
        private readonly refreshSecret: string = process.env.JWT_REFRESH_SECRET || 'temprefreshsecret',
    ) { }

    async generateAccessToken(payload: object): Promise<string> {
        
        const token= jwt.sign(payload, this.accessSecret, { expiresIn: accessTokenMaxAge });
        if(!token){
            logger.warn("Failed to generate access token");
            throw new AppError(MESSAGES.ACCESS_TOKEN_NOT_CREATED,STATUS_CODES.SERVICE_UNAVAILABLE,false)
        }
        logger.info("Access token genetated successfully");
        return token
    }


    async generateRefreshToken(payload: object): Promise<string> {
        const token= jwt.sign(payload, this.refreshSecret, { expiresIn: refreshTokenMaxAge });
        if(!token){
            logger.warn("Failed to generate refresh token");
            throw new AppError(MESSAGES.REFRESH_TOKEN_NOT_CREATED,STATUS_CODES.SERVICE_UNAVAILABLE,false)
        }
        logger.info("Refresh token genetated successfully");
        return token;
    }

    async verifyAccessToken<T>(token: string): Promise<T> {
        
        try {
            return jwt.verify(token, this.accessSecret) as T;
        } catch {
            logger.warn("Failed to verify access token");
            throw new AppError(MESSAGES.INVALID_TOKEN,STATUS_CODES.UNAUTHORIZED);
        }
    }

    async verifyRefreshToken<T>(token: string): Promise<T> {

        try {
            return jwt.verify(token, this.refreshSecret) as T;
        } catch {
            logger.warn("Failed to verify refresh token");
            throw new AppError(MESSAGES.INVALID_REFRESH_TOKEN,STATUS_CODES.BAD_REQUEST);
        }
    }

    decodeToken<T>(token: string): T | null {
        try {
            return jwt.decode(token) as T;
        } catch {
            return null;
        }
    }
}
