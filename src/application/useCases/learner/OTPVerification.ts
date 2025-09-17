
import { ICacheService } from "@domain/interfaces/ICacheService";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";


import { hashPassword } from "shared/utils/hash";


export class LearnerOTPVerificationUseCase {
    constructor(
        private _cacheService: ICacheService,
        private _learnerRepository: ILearnerRepository
    ) { }

    async execute(input: {otp:string,email:string}): Promise<{success:boolean,message:string}> {
        const { email, otp } = input;
        const userOTP = await this._cacheService.get(`${email}:otp`)
        if (!userOTP) {
            throw new AppError(MESSAGES.OTP_EXPIRED, STATUS_CODES.GONE)

        }
        const user = await this._cacheService.get(`${email}:signup`)
        if (!user) {
            throw new AppError(MESSAGES.SIGNUP_TIMEOUT, STATUS_CODES.REQUEST_TIMEOUT)

        }
        if (otp !== userOTP) {
            throw new AppError(MESSAGES.INVALID_OTP, STATUS_CODES.UNAUTHORIZED)
        }
        const hashedPassword = await hashPassword(user.password);

        const learnerCreated = await this._learnerRepository.create({
            email: user.email,
            name: user.name,
            password: hashedPassword,
            isActive: true,
            walletBalance: 0
        })
        if (learnerCreated) {
            return { success: true, message: MESSAGES.LEARNER_CREATED }
        } else {
            throw new AppError(MESSAGES.LEARNER_NOT_CREATED, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

}