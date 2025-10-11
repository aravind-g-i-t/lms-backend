import { IAdminSigninUseCase } from "@application/IUseCases/admin/ISignin";
import { IAdminRepository } from "@domain/interfaces/IAdminRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword } from "shared/utils/hash";

export class AdminSigninUseCase implements IAdminSigninUseCase{
    constructor(
        private _adminRepository:IAdminRepository,
        private _tokenService:ITokenService
    ){}

    async execute({email,password}:{email:string,password:string}){
        
        const admin=await this._adminRepository.findByEmail(email);
        
        if(!admin){
            throw new AppError(MESSAGES.NO_ACCOUNT,STATUS_CODES.NOT_FOUND)
        }

        const passwordMatch=await comparePassword(password,admin.password);
        if(!passwordMatch){
            throw new AppError(MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED)

        }
        const accessToken= await this._tokenService.generateAccessToken({role:'admin',id:admin.id});
        
        const refreshToken=await this._tokenService.generateRefreshToken({role:'admin',id:admin.id});
        
        return {id:admin.id,email:admin.email,accessToken,refreshToken}
    }
}