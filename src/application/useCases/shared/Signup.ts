import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { ICacheService } from "@domain/interfaces/ICacheService";
import { IEmailService } from "@domain/interfaces/IEmailService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { generateOTP } from "shared/utils/generateOTP";


export class UserSignupUseCase {
    constructor(
        private learnerRepository:ILearnerRepository,
        private instructorRepository: IInstructorRepository,
        private businessRepositoty:IBusinessRepository,
        private cacheService:ICacheService,
        private emailService:IEmailService
    ) {}

    async execute(signupInput:{name:string,email:string,password:string,role:string}){
            console.log('signupUseCase')
            const {email,role}=signupInput;
            console.log('signupInput',signupInput)
            let repository;
            if(role==='learner'){
                repository=this.learnerRepository
            }else if(role==='instructor'){
                repository=this.instructorRepository
            }else{
                const emailValid = this.isBusinessEmail(email);
                            if (!emailValid) {
                                throw new AppError(MESSAGES.NOT_COMPANY_EMAIL,STATUS_CODES.BAD_REQUEST);
                            }
                repository=this.businessRepositoty;
            }
            const emailExists=await repository.findByEmail(email);
            if(emailExists){
                throw new AppError(MESSAGES.EMAIL_EXISTS,STATUS_CODES.CONFLICT);
            }
            const otp=generateOTP();
            console.log(otp);
            
            await this.emailService.send(
                email,
                'NlightN OTP verification',
                `Your OTP for NlightN account is ${otp}`
            );
            const otpKey=`${email}:otp`;
            const signupDataKey=`${email}:signup`;
            console.log(this.cacheService);
            
            await this.cacheService.set(signupDataKey,signupInput,600);
            await this.cacheService.set(otpKey,otp,120);
            const otpExpiresAt=new Date(Date.now() + 2 * 60 * 1000)
            return {email,otpExpiresAt,role}

    }
     isBusinessEmail(email: string): boolean {
        const freeDomains = [
            "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
            "icloud.com", "aol.com", "protonmail.com", "zoho.com"
        ];

        const domain = email.split("@")[1].toLowerCase();
        return !freeDomains.includes(domain);
    }
}