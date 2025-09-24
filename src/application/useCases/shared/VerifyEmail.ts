
import { IVerifyEmailUseCase } from "@application/IUseCases/shared/IVerifyEmail";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { ICacheService } from "@domain/interfaces/ICacheService";
import { IEmailService } from "@domain/interfaces/IEmailService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

import { generateOTP } from "shared/utils/generateOTP";


export class VerifyEmailUseCase implements IVerifyEmailUseCase{
    constructor(
        private cacheService:ICacheService,
        private emailService:IEmailService,
        private _learnerRepository:ILearnerRepository,
        private _instructorRepository:IInstructorRepository,
        private _businessRepository: IBusinessRepository
    ) {}

    async execute(email:string,role:string):Promise<Date>{

        let repository;
        switch (role) {
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
        let user=await repository.findByEmail(email);
        if(!user){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
            const cacheKey=`${email}:otp`;
            const otp=generateOTP();
            await this.emailService.send(
                email,
                'NlightN OTP verification',
                `Your OTP for NlightN account is ${otp}`
            );
            await this.cacheService.set(cacheKey,otp,120);
            const otpExpiresAt=new Date(Date.now() + 2 * 60 * 1000)
            
            return otpExpiresAt;
    }
}