import { GetInstructorDataOutputDTO } from "@application/dtos/instructor/GetInstructorData";
import { IGetInstructorDataUseCase } from "@application/IUseCases/instructor/IGetInstructorData";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetInstructorDataUseCase implements IGetInstructorDataUseCase {
    constructor(
        private _instructorRepository: IInstructorRepository,
        private _fileStorageService: IFileStorageService
    ) {}

    async execute(id: string): Promise<GetInstructorDataOutputDTO> {
        const user = await this._instructorRepository.findById(id, true);
        if (!user) {
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }

        const profilePicUrl = user.profilePic
            ? await this._fileStorageService.getViewURL(user.profilePic)
            : null;

        const idProofUrl = user.identityProof
            ? await this._fileStorageService.getViewURL(user.identityProof)
            : null;

        const resumeUrl = user.resume
            ? await this._fileStorageService.getViewURL(user.resume)
            : null;

        const dto = InstructorDTOMapper.toGetInstructorProfile({
            ...user,
            profilePic: profilePicUrl,
            identityProof: idProofUrl,
            resume: resumeUrl
        });

        return dto;
    }
}

