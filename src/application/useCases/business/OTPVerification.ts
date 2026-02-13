
import { ICacheService } from "@domain/interfaces/ICacheService";

import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { hashPassword } from "shared/utils/hash";
import { AppError } from "shared/errors/AppError";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUserOTPVerificationUseCase } from "@application/IUseCases/shared/IUserOTPVerification";


interface SignupData{
    name:string,
    email:string,
    password:string
}

export class BusinessOTPVerificationUseCase implements IUserOTPVerificationUseCase{
    constructor(
        private _cacheService: ICacheService,
        private _businessRepository: IBusinessRepository
    ) { }

    async execute(input: {email:string,otp:string}): Promise<void> {            
        const { email, otp } = input;
        const userOTP = await this._cacheService.get<string>(`${email}:otp`)
        if (!userOTP) {
            throw new AppError(MESSAGES.OTP_EXPIRED,STATUS_CODES.GONE);
        }
        const user = await this._cacheService.get<SignupData>(`${email}:signup`)
        if (!user) {
            throw new AppError(MESSAGES.SIGNUP_TIMEOUT,STATUS_CODES.REQUEST_TIMEOUT);
        }
        if (otp !== userOTP) {
            throw new AppError(MESSAGES.INVALID_OTP,STATUS_CODES.UNAUTHORIZED);
        }
        
        const hashedPassword = await hashPassword(user.password);

        const businessCreated = await this._businessRepository.create({
            email: user.email,
            name: user.name,
            password: hashedPassword,
            employees:[],
            isActive:true,
        })
        if(businessCreated){
            return;
        }else{
            throw new AppError(MESSAGES.SIGNUP_FAILED,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }

    
}