
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
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
export class UserRefreshTokenUseCase{
    constructor(
        private _tokenService:ITokenService,
        private _learnerRepository:ILearnerRepository,
        private _instructorRepository:IInstructorRepository,
        private _businessRepository:IBusinessRepository, 
    ){}

    async execute(refreshToken:string){
        console.log('entered usecase');
        
        const payload:TokenPayload=await this._tokenService.verifyRefreshToken(refreshToken);

        let repository;
        switch (payload.role) {
            case 'learner':
                repository=this._learnerRepository;
                break;
            case 'instructor':
                repository=this._instructorRepository;
                break;
            default:
                repository=this._businessRepository;
                break;
        }

        const user=await repository.findById(payload.id);
        if(!user){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED);
        }
        const accessToken=this._tokenService.generateAccessToken({id:payload.id,role:payload.role});
        return accessToken;
    }
}