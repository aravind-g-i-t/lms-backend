import { IUpdateLearnerDataUseCase } from "@application/IUseCases/learner/IUpdateLearnerData";
import { Learner } from "@domain/entities/Learner";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateLearnerDataUseCase implements IUpdateLearnerDataUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}

    async execute(id: string, update: Partial<Learner>): Promise<Learner> {
        const learner=await this._learnerRepository.findByIdAndUpdate(id,update);
        if(!learner){
            throw new AppError(MESSAGES.BUSINESS_NOT_UPDATED,STATUS_CODES.NOT_MODIFIED)
        }
        return learner;
    }
}