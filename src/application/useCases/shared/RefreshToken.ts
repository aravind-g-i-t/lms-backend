
import { IRefreshTokenUseCase } from "@application/IUseCases/shared/IRefreshToken";
import { IAdminRepository } from "@domain/interfaces/IAdminRepository";
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
export class UserRefreshTokenUseCase implements IRefreshTokenUseCase{
    constructor(
        private _tokenService:ITokenService,
        private _learnerRepository:ILearnerRepository,
        private _instructorRepository:IInstructorRepository,
        private _businessRepository:IBusinessRepository, 
        private _adminRepository:IAdminRepository
    ){}

    async execute(refreshToken:string):Promise<string>{
        console.log('entered usecase');
        
        const payload:TokenPayload=await this._tokenService.verifyRefreshToken(refreshToken);

        let repository;
        let adminRepository;
        switch (payload.role) {
            case 'learner':
                repository=this._learnerRepository;
                break;
            case 'instructor':
                repository=this._instructorRepository;
                break;
            case 'business':
                repository=this._businessRepository;
                break;
            default:
                adminRepository=this._adminRepository;
                break;
        }
        if(adminRepository){
            const admin=adminRepository.findById(payload.id)
            if(!admin){
                throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND);
            }
        }
        if(repository){
            const user=await repository.findById(payload.id);
            if(!user){
                throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND);
            }
            if(!user.isActive){
                throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN);
            }
        }

        const accessToken=this._tokenService.generateAccessToken({id:payload.id,role:payload.role});
        return accessToken;
    }
}