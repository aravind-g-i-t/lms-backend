import { IUserSignupUseCase } from "@application/IUseCases/shared/ISignupUseCase";
import { ICacheService } from "@domain/interfaces/ICacheService";
import { IEmailService } from "@domain/interfaces/IEmailService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { generateOTP } from "shared/utils/generateOTP";


const OTP_TTL = parseInt(process.env.OTP_TTL_SECONDS || "120", 10);
const SIGNUPDATA_TTL = parseInt(process.env.SIGNUPDATA_TTL_SECONDS || "600", 10);

interface SignupData{
    name:string,
    email:string,
    password:string
}

export class UserSignupUseCase implements IUserSignupUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository,
        private _instructorRepository: IInstructorRepository,
        private _cacheService:ICacheService,
        private _emailService:IEmailService
    ) {}

    async execute(signupInput:{name:string,email:string,password:string,role:string}){
            
            const {email,role}=signupInput;
            let repository;
            if(role==='learner'){
                repository=this._learnerRepository
            }else {
                repository=this._instructorRepository
            }
            const emailExists=await repository.findByEmail(email,true);
            if(emailExists &&emailExists?.password){
                throw new AppError(MESSAGES.EMAIL_EXISTS,STATUS_CODES.CONFLICT);
            }
            if(emailExists){
                throw new AppError(MESSAGES.USE_GOOGLE_SIGNIN_MESSAGE,STATUS_CODES.CONFLICT)
            }
            const otp=generateOTP();            
            console.log("otp",otp)
            await this._emailService.send(
                email,
                'NlightN OTP verification',
                `Your OTP for NlightN account is ${otp}`
            );
            const otpKey=`${email}:otp`;
            const signupDataKey=`${email}:signup`;            
            await this._cacheService.set<SignupData>(signupDataKey,signupInput,SIGNUPDATA_TTL);
            await this._cacheService.set<string>(otpKey,otp,OTP_TTL);
            const otpExpiresAt=new Date(Date.now() + 2 * 60 * 1000)
            return {email,otpExpiresAt,role}

    }

}