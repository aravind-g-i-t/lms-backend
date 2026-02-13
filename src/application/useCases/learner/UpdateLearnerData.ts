import { LearnerAsRaw } from "@application/dtos/learner/LearnerDTO";
import { IUpdateLearnerDataUseCase } from "@application/IUseCases/learner/IUpdateLearnerData";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateLearnerDataUseCase implements IUpdateLearnerDataUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}

    async execute(id: string, update: Partial<LearnerAsRaw>): Promise<void> {
        const learner=await this._learnerRepository.findByIdAndUpdate(id,update);
        if(!learner){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        return;
    }
}