
import { IGoogleAuthService } from "@domain/interfaces/IGoogleAuthService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class InstructorGoogleSigninUseCase {
    constructor(
        private _instructorRepository: IInstructorRepository,
        private _tokenService: ITokenService,
        private _googleAuthService:IGoogleAuthService,
    ) { }

    async execute(token:string) {
        const userInfo=await this._googleAuthService.getUserInfo(token);
        const {sub,email,name,picture}=userInfo
        console.log(userInfo);
        let instructor=await this._instructorRepository.findByEmail(email);
        if(!instructor){
            instructor=await this._instructorRepository.create({
                name,
                email,
                profilePic:picture,
                isActive:true,
                isVerified:false,
                walletBalance:0
            })
        }

        if (!instructor) {
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_CREATED,STATUS_CODES.UNAUTHORIZED);
        }
        if (!instructor.isActive) {
            throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN);
        }
        const role='instructor'

        const accessToken = await this._tokenService.generateAccessToken({ id: instructor.id, role });
        const refreshToken = await this._tokenService.generateRefreshToken({ id: instructor.id, role });
        return {
            user:instructor,
            accessToken,
            refreshToken,
            role
        };
    }

}