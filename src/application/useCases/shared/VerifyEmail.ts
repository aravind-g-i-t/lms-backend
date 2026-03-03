
import { IVerifyEmailUseCase } from "@application/IUseCases/shared/IVerifyEmail";
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
        private _cacheService:ICacheService,
        private _emailService:IEmailService,
        private _learnerRepository:ILearnerRepository,
        private _instructorRepository:IInstructorRepository,
    ) {}

    async execute(email:string,role:string):Promise<Date>{

        let repository;
        switch (role) {
            case 'learner':
                repository=this._learnerRepository;
                break;
            default:
                repository=this._instructorRepository;
                break;
            
        }
        const user=await repository.findByEmail(email);
        if(!user){
            throw new AppError(MESSAGES.NO_ACCOUNT,STATUS_CODES.NOT_FOUND)
        }
            const cacheKey=`${email}:otp`;
            const otp=generateOTP();
            await this._emailService.send(
                email,
                'NlightN OTP verification',
                `Your OTP for NlightN account is ${otp}`
            );
            await this._cacheService.set<string>(cacheKey,otp,120);
            const otpExpiresAt=new Date(Date.now() + 2 * 60 * 1000)
            
            return otpExpiresAt;
    }
}