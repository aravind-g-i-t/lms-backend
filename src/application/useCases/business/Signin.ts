
import { UserSigninInputDTO, UserSigninOutputDTO } from "@application/dtos/shared/Signin";
import {  IBusinessSigninUseCase } from "@application/IUseCases/business/IBusinessSigninUseCase";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";

import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword } from "shared/utils/hash";

export class BusinessSigninUseCase implements IBusinessSigninUseCase{
    constructor(
        private _businessRepository: IBusinessRepository,
        private _tokenService:ITokenService
    ) { }



    async execute(input: UserSigninInputDTO):Promise<UserSigninOutputDTO> {

            const {email,password,role}=input;

            const businessEntity=await this._businessRepository.findByEmail(email,true);

            if(!businessEntity){
                throw new AppError(MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED);
            }
            if(!businessEntity.isActive){
                throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN);
            }
            
            if(!businessEntity.password){
                throw new AppError(MESSAGES.USE_GOOGLE_SIGNIN_MESSAGE,STATUS_CODES.CONFLICT);
            }
            const passwordValid= await comparePassword(password,businessEntity.password)

            if(!passwordValid){
                throw new AppError(MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED);
            }

            const accessToken= await this._tokenService.generateAccessToken({id:businessEntity.id,role});
            
            const refreshToken= await this._tokenService.generateRefreshToken({id:businessEntity.id,role});
            return {
                user:BusinessDTOMapper.toSigninDTO(businessEntity),
                accessToken,
                refreshToken,
                role
            };
    }

}