
import { IUserOTPVerificationUseCase } from "@application/IUseCases/shared/IUserOTPVerification";
import { ICacheService } from "@domain/interfaces/ICacheService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { hashPassword } from "shared/utils/hash";


interface SignupData{
    name:string,
    email:string,
    password:string
}

export class InstructorOTPVerificationUseCase implements IUserOTPVerificationUseCase{
    constructor(
        private _cacheService: ICacheService,
        private _instructorRepository: IInstructorRepository
    ) { }

    async execute(input: {email:string,otp:string}):Promise<void>{
        const { email, otp } = input;
        const userOTP = await this._cacheService.get(`${email}:otp`)
        if (!userOTP) {
            throw new AppError(MESSAGES.OTP_EXPIRED,STATUS_CODES.GONE)
        }
        const user = await this._cacheService.get<SignupData>(`${email}:signup`)
        if (!user) {
            throw new AppError(MESSAGES.SIGNUP_TIMEOUT,STATUS_CODES.REQUEST_TIMEOUT);
        }
        if (otp !== userOTP) {
            throw new AppError(MESSAGES.INVALID_OTP,STATUS_CODES.UNAUTHORIZED);
        }
        const hashedPassword = await hashPassword(user.password);

        const instructorCreated = await this._instructorRepository.create({
            email: user.email,
            name: user.name,
            password: hashedPassword,
            isActive:true,
            walletBalance:0,
            expertise:[],
        });
        if(instructorCreated){
            return;
        }else{
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_CREATED,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }

}