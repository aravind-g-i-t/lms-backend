
import { UserSigninOutputDTO } from "@application/dtos/shared/Signin";
import { IInstructorGoogleSigninUseCase } from "@application/IUseCases/instructor/IGoogleSignin";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { IGoogleAuthService } from "@domain/interfaces/IGoogleAuthService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class InstructorGoogleSigninUseCase implements IInstructorGoogleSigninUseCase {
    constructor(
        private _instructorRepository: IInstructorRepository,
        private _tokenService: ITokenService,
        private _googleAuthService:IGoogleAuthService,
    ) { }

    async execute(token:string):Promise<UserSigninOutputDTO> {
        const userInfo=await this._googleAuthService.getUserInfo(token);
        const {sub,email,name}=userInfo
        let instructor=await this._instructorRepository.findByEmail(email);
        if(instructor && !instructor.isActive){
                    throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN)
                }
                if(instructor && !instructor.googleId){
                    instructor=await this._instructorRepository.findByIdAndUpdate(instructor.id,{googleId:sub});
                }
        if(!instructor){
            instructor=await this._instructorRepository.create({
                name,
                email,
                isActive:true,
                walletBalance:0,
                expertise:[],
                googleId:sub,
                verification:{
                    status:"Not Submitted",
                    remarks:null
                }
            })
        }

        if (!instructor) {
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_CREATED,STATUS_CODES.UNAUTHORIZED);
        }

        const role='instructor'

        const accessToken = await this._tokenService.generateAccessToken({ id: instructor.id, role });
        const refreshToken = await this._tokenService.generateRefreshToken({ id: instructor.id, role });
        
        return {
            user:InstructorDTOMapper.toSigninDTO(instructor),
            accessToken,
            refreshToken,
            role
        };
    }

}