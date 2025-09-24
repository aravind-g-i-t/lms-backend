
import { IResendOTPUseCase } from "@application/IUseCases/shared/IResendOTPUseCase";
import { ICacheService } from "@domain/interfaces/ICacheService";
import { IEmailService } from "@domain/interfaces/IEmailService";

import { generateOTP } from "shared/utils/generateOTP";


export class ResendOTPUseCase implements IResendOTPUseCase{
    constructor(
        private cacheService: ICacheService,
        private emailService: IEmailService
    ) { }

    async execute(email: string):Promise<Date> {
        const cacheKey = `${email}:otp`;
        const otp = generateOTP();
        await this.emailService.send(
            email,
            'NlightN OTP verification',
            `Your OTP for NlightN account is ${otp}`
        );
        await this.cacheService.set(cacheKey, otp, 120);
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000)

        return otpExpiresAt;
    }
}