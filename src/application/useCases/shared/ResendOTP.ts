
import { IResendOTPUseCase } from "@application/IUseCases/shared/IResendOTPUseCase";
import { ICacheService } from "@domain/interfaces/ICacheService";
import { IEmailService } from "@domain/interfaces/IEmailService";
import { generateOTP } from "shared/utils/generateOTP";

const OTP_TTL = parseInt(process.env.OTP_TTL_SECONDS || "120", 10);

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
        await this.cacheService.set(cacheKey, otp, OTP_TTL);
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000)

        return otpExpiresAt;
    }
}