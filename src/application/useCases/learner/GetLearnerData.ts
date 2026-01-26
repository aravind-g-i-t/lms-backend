import { GetLearnerDataOutput } from "@application/dtos/learner/GetLearnerData";
import { IGetLearnerDataUseCase } from "@application/IUseCases/learner/IGetLearnerData";
import { LearnerDTOMapper } from "@application/mappers/LearnerMapper";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetLearnerDataUseCase implements IGetLearnerDataUseCase {
    constructor(
        private _learnerRepository: ILearnerRepository,
        private _fileStorageService: IFileStorageService
    ) { }
    async execute(id: string): Promise<GetLearnerDataOutput> {
        const user = await this._learnerRepository.findById(id, true);
        if (!user) {
            throw new AppError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }

        const profileDTO = LearnerDTOMapper.toProfileDTO(user);

        if (user.profilePic) {
            profileDTO.profilePic = await this._fileStorageService.getViewURL(user.profilePic);
        }

        return profileDTO;
    }

}