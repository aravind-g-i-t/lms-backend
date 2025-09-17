import { OTPVerificationRequestDTO, OTPVerificationResponseDTO } from "@application/dtos/shared/OTPVerification";
import { ICacheService } from "@domain/interfaces/ICacheService";

import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { hashPassword } from "shared/utils/hash";
import { AppError } from "shared/errors/AppError";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";


export class BusinessOTPVerificationUseCase {
    constructor(
        private _cacheService: ICacheService,
        private _businessRepository: IBusinessRepository
    ) { }

    async execute(input: OTPVerificationRequestDTO): Promise<OTPVerificationResponseDTO> {            
        const { email, otp } = input;
        const userOTP = await this._cacheService.get(`${email}:otp`)
        if (!userOTP) {
            throw new AppError(MESSAGES.OTP_EXPIRED,STATUS_CODES.GONE);
        }
        const user = await this._cacheService.get(`${email}:signup`)
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
            isActive:true
        })
        if(businessCreated){
            return {success:true,message:'Business account created. Please login to enter'}
        }else{
            throw new AppError(MESSAGES.BUSINESS_NOT_CREATED,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }

    
}