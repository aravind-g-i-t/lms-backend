


import { IInstructorSigninUseCase, InstructorSigninUseCaseOutput } from "@application/IUseCases/instructor/IInstructrorSigninUseCase";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword } from "shared/utils/hash";

export class InstructorSigninUseCase implements IInstructorSigninUseCase {
    constructor(
        private _instructorRepository: IInstructorRepository,
        private _tokenService:ITokenService
    ) { }

    async execute(input: {email:string,password:string,role:'learner'|'instructor'|'business'}):Promise<InstructorSigninUseCaseOutput> {
            const {email,password,role}=input;
            const instructorEntity=await this._instructorRepository.findByEmail(email,true);
            if(!instructorEntity){
                throw new AppError(MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED);
            }
            if(!instructorEntity.password){
                throw new AppError(MESSAGES.USE_GOOGLE_SIGNIN_MESSAGE,STATUS_CODES.UNAUTHORIZED);
            }
            
            if(!instructorEntity.isActive){
                throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN);
            }
            const passwordValid= await comparePassword(password,instructorEntity.password)
            if(!passwordValid){
                throw new AppError(MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED);
            }
            const accessToken= await this._tokenService.generateAccessToken({id:instructorEntity.id,role});
            const refreshToken= await this._tokenService.generateRefreshToken({id:instructorEntity.id,role});
            return {
                user:instructorEntity,
                accessToken,
                refreshToken,
                role
            };

    }

}