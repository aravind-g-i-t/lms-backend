
import { UserSigninInputDTO, UserSigninOutputDTO } from "@application/dtos/shared/Signin";
import { ILearnerSigninUseCase } from "@application/IUseCases/learner/ILearnerSigninUseCase";
import { LearnerDTOMapper } from "@application/mappers/LearnerMapper";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword } from "shared/utils/hash";

export class LearnerSigninUseCase implements ILearnerSigninUseCase {
    constructor(
        private _learnerRepository: ILearnerRepository,
        private _tokenService: ITokenService,
        private _fileStorageService: IFileStorageService 
    ) {}

    async execute(input: UserSigninInputDTO): Promise<UserSigninOutputDTO> {
        const { email, password, role } = input;
        const learnerEntity = await this._learnerRepository.findByEmail(email, true);
        if (!learnerEntity) {
            throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
        }
        if (!learnerEntity.isActive) {
            throw new AppError(MESSAGES.BLOCKED, STATUS_CODES.FORBIDDEN);
        }
        if (!learnerEntity.password) {
            throw new AppError(MESSAGES.USE_GOOGLE_SIGNIN_MESSAGE, STATUS_CODES.CONFLICT);
        }
        const passwordValid = await comparePassword(password, learnerEntity.password);
        if (!passwordValid) {
            throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
        }

        if (learnerEntity.profilePic) {
            learnerEntity.profilePic = await this._fileStorageService.getDownloadUrl(learnerEntity.profilePic);
        }

        const accessToken = await this._tokenService.generateAccessToken({ id: learnerEntity.id, role });
        const refreshToken = await this._tokenService.generateRefreshToken({ id: learnerEntity.id, role });

        return {
            user: LearnerDTOMapper.toSigninDTO(learnerEntity),
            accessToken,
            refreshToken,
            role
        };
    }
}
