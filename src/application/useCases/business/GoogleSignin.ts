
import { IGoogleAuthService } from "@domain/interfaces/IGoogleAuthService";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { IBusinessGoogleSigninUseCase } from "@application/IUseCases/business/IGoogleSignin";
import { UserSigninOutputDTO } from "@application/dtos/shared/Signin";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";

export class BusinessGoogleSigninUseCase implements IBusinessGoogleSigninUseCase{
    constructor(
        private _businessRepository: IBusinessRepository,
        private _tokenService: ITokenService,
        private _googleAuthService: IGoogleAuthService,
    ) { }



    async execute(token: string):Promise<UserSigninOutputDTO> {
        const userInfo = await this._googleAuthService.getUserInfo(token);
        const { sub, email, name } = userInfo
        let business = await this._businessRepository.findByEmail(email);
        if(business && !business.isActive){
            throw new AppError(MESSAGES.BLOCKED,STATUS_CODES.UNAUTHORIZED)
        }
        if(business && !business.googleId){
            business=await this._businessRepository.findByIdAndUpdate(business.id,{googleId:sub});
        }
        if (!business) {
            const emailValid = this.isBusinessEmail(email);
            if (!emailValid) {
                throw new AppError(MESSAGES.NOT_COMPANY_EMAIL, STATUS_CODES.BAD_REQUEST);
            }
            business = await this._businessRepository.create({
                name,
                email,
                isActive: true,
                employees: [],
                googleId:sub
            })
        }

        if (!business) {
            throw new AppError(MESSAGES.SIGNUP_FAILED, STATUS_CODES.UNAUTHORIZED);
        }
        const role = 'business'

        const accessToken = await this._tokenService.generateAccessToken({ id: business.id, role });
        const refreshToken = await this._tokenService.generateRefreshToken({ id: business.id, role });
        return {
            user: BusinessDTOMapper.toSigninDTO(business),
            accessToken,
            refreshToken,
            role
        };
    }


    isBusinessEmail(email: string): boolean {
        const freeDomains = [
            "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
            "icloud.com", "aol.com", "protonmail.com", "zoho.com"
        ];

        const domain = email.split("@")[1].toLowerCase();
        return !freeDomains.includes(domain);
    }

}