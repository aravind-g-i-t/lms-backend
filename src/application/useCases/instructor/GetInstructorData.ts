import { GetInstructorDataOutputDTO } from "@application/dtos/instructor/GetInstructorData";
import { IGetInstructorDataUseCase } from "@application/IUseCases/instructor/IGetInstructorData";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetInstructorDataUseCase implements IGetInstructorDataUseCase {
    constructor(
        private _instructorRepository: IInstructorRepository,
        private _fileStorageService: IS3Service
    ) {}

    async execute(id: string): Promise<GetInstructorDataOutputDTO> {
        const user = await this._instructorRepository.findById(id, true);
        if (!user) {
            throw new AppError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }

        const profilePicUrl = user.profilePic
            ? await this._fileStorageService.getDownloadUrl(user.profilePic)
            : null;

        const idProofUrl = user.identityProof
            ? await this._fileStorageService.getDownloadUrl(user.identityProof)
            : null;

        const resumeUrl = user.resume
            ? await this._fileStorageService.getDownloadUrl(user.resume)
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

