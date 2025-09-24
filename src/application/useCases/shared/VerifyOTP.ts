
import { IUserOTPVerificationUseCase } from "@application/IUseCases/shared/IUserOTPVerification";
import { ICacheService } from "@domain/interfaces/ICacheService";

import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";


import { hashPassword } from "shared/utils/hash";


export class OTPVerificationUseCase implements IUserOTPVerificationUseCase{
    constructor(
        private _cacheService: ICacheService,
    ) { }

    async execute(input: {otp:string,email:string}): Promise<void> {
        const { email, otp } = input;
        const userOTP = await this._cacheService.get(`${email}:otp`)
        console.log(email,otp,userOTP);
        
        if (!userOTP) {
            throw new AppError(MESSAGES.OTP_EXPIRED, STATUS_CODES.GONE)

        }
    
        if (otp !== userOTP) {
            throw new AppError(MESSAGES.INVALID_OTP, STATUS_CODES.UNAUTHORIZED)
        }
        
    }

}