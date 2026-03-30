
import { IGetProfilePicUseCase } from "@application/IUseCases/shared/IGetProfilePic";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetLearnerProfilePicUseCase implements IGetProfilePicUseCase {
    constructor(
        private _learnerRepository: ILearnerRepository,
    ) { }
    async execute(learnerId: string): Promise<string|null> {
        const learner = await this._learnerRepository.findById(learnerId);
        if (!learner) {
            throw new AppError(MESSAGES.LEARNER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }
        return learner.profilePic
    }

}