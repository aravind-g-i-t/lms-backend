import { IRefreshTokenUseCase } from "@application/IUseCases/shared/IRefreshToken";
import { IAdminRepository } from "@domain/interfaces/IAdminRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
type TokenPayload={
    id:string,
    role:string,
    iat?:number,
    exp?:number
}
export class AdminRefreshTokenUseCase implements IRefreshTokenUseCase{
    constructor(
        private _tokenService:ITokenService,
        private _adminRepository:IAdminRepository
    ){}

    async execute(refreshToken:string){
        
        const payload:TokenPayload=await this._tokenService.verifyRefreshToken(refreshToken);

        const admin=await this._adminRepository.findById(payload.id);
        if(!admin){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED);
        }
        const accessToken=this._tokenService.generateAccessToken({id:payload.id,role:payload.role});
        return accessToken;
    }
}