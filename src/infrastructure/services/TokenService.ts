import jwt , {SignOptions} from 'jsonwebtoken';
import { ITokenService } from '@domain/interfaces/ITokenService';
import { AppError } from 'shared/errors/AppError';
import { MESSAGES } from 'shared/constants/messages';
import { STATUS_CODES } from 'shared/constants/httpStatus';


const accessTokenMaxAge = (process.env.ACCESS_TOKEN_MAX_AGE || "1m") as SignOptions["expiresIn"];
const refreshTokenMaxAge = (process.env.REFRESH_TOKEN_MAX_AGE || "7d") as SignOptions["expiresIn"];




export class TokenService implements ITokenService {
    constructor(
        private readonly accessSecret: string = process.env.JWT_ACCESS_SECRET || 'tempaccesssecret',
        private readonly refreshSecret: string = process.env.JWT_REFRESH_SECRET || 'temprefreshsecret',
    ) { }

    async generateAccessToken(payload: object): Promise<string> {
        
        console.log(this.accessSecret);
        

        return jwt.sign(payload, this.accessSecret, { expiresIn: accessTokenMaxAge });
    }


    async generateRefreshToken(payload: object): Promise<string> {
        console.log(this.accessSecret);
        return jwt.sign(payload, this.refreshSecret, { expiresIn: refreshTokenMaxAge });
    }

    async verifyAccessToken<T>(token: string): Promise<T> {
        
        try {
            console.log(this.accessSecret);
            console.log('recievedAccessToken',token);
            
            
            return jwt.verify(token, this.accessSecret) as T;
        } catch {
            throw new AppError(MESSAGES.INVALID_TOKEN,STATUS_CODES.UNAUTHORIZED);
        }
    }

    async verifyRefreshToken<T>(token: string): Promise<T> {
        console.log('entered verifyRefreshToken');

        try {
            console.log(this.refreshSecret);
            
            return jwt.verify(token, this.refreshSecret) as T;
        } catch {
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
