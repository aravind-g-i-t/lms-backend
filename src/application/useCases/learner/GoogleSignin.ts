
import { UserSigninOutputDTO } from "@application/dtos/shared/Signin";
import { ILearnerGoogleSigninUseCase } from "@application/IUseCases/learner/IGoogleSignin";
import { LearnerDTOMapper } from "@application/mappers/LearnerMapper";
import { IGoogleAuthService } from "@domain/interfaces/IGoogleAuthService";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class LearnerGoogleSigninUseCase implements ILearnerGoogleSigninUseCase {
    constructor(
        private _learnerRepository: ILearnerRepository,
        private _tokenService: ITokenService,
        private _googleAuthService:IGoogleAuthService,
    ) { }

    async execute(token:string):Promise<UserSigninOutputDTO> {
        const userInfo=await this._googleAuthService.getUserInfo(token);
        const {sub,email,name}=userInfo
        let learner=await this._learnerRepository.findByEmail(email);
        if(learner && !learner.isActive){
                    throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.UNAUTHORIZED)
                }
                if(learner && !learner.googleId){
                    learner=await this._learnerRepository.findByIdAndUpdate(learner.id,{googleId:sub});
                }
        if(!learner){
            learner=await this._learnerRepository.create({
                name,
                email,
                isActive:true,
                walletBalance:0,
                googleId:sub
            })
        }

        if (!learner) {
            throw new AppError(MESSAGES.LEARNER_NOT_CREATED,STATUS_CODES.UNAUTHORIZED);
        }
        if (!learner.isActive) {
            throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN);
        }
        const role='learner'

        const accessToken = await this._tokenService.generateAccessToken({ id: learner.id, role });
        const refreshToken = await this._tokenService.generateRefreshToken({ id: learner.id, role });
        return {
            user:LearnerDTOMapper.toSigninDTO(learner),
            accessToken,
            refreshToken,
            role
        };
    }

}