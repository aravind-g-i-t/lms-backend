


import { UserSigninInputDTO, UserSigninOutputDTO } from "@application/dtos/shared/Signin";
import { IInstructorSigninUseCase } from "@application/IUseCases/instructor/IInstructrorSigninUseCase";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { ITokenService } from "@domain/interfaces/ITokenService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword } from "shared/utils/hash";

export class InstructorSigninUseCase implements IInstructorSigninUseCase {
    constructor(
        private _instructorRepository: IInstructorRepository,
        private _tokenService: ITokenService,
        private _fileStorageService: IFileStorageService
    ) {}

    async execute(input: UserSigninInputDTO): Promise<UserSigninOutputDTO> {
        const { email, password, role } = input;

        const instructorEntity = await this._instructorRepository.findByEmail(email, true);
        if (!instructorEntity) {
            throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
        }
        if (!instructorEntity.password) {
            throw new AppError(MESSAGES.USE_GOOGLE_SIGNIN_MESSAGE, STATUS_CODES.UNAUTHORIZED);
        }
        if (!instructorEntity.isActive) {
            throw new AppError(MESSAGES.BLOCKED, STATUS_CODES.FORBIDDEN);
        }

        const passwordValid = await comparePassword(password, instructorEntity.password);
        if (!passwordValid) {
            throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
        }

        // Generate profilePic URL
        const profilePicUrl = instructorEntity.profilePic
            ? await this._fileStorageService.getViewURL(instructorEntity.profilePic)
            : null;

        const accessToken = await this._tokenService.generateAccessToken({ id: instructorEntity.id, role });
        const refreshToken = await this._tokenService.generateRefreshToken({ id: instructorEntity.id, role });

        return {
            user: InstructorDTOMapper.toSigninDTO({ ...instructorEntity, profilePic: profilePicUrl }),
            accessToken,
            refreshToken,
            role
        };
    }
}
