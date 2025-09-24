import { IGetLearnerDataUseCase } from "@application/IUseCases/learner/IGetLearnerData";
import { Learner } from "@domain/entities/Learner";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetLearnerDataUseCase implements IGetLearnerDataUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}
    async execute(id: string): Promise<Learner> {
        const user=await this._learnerRepository.findById(id,true);
        if(!user){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        return user;
    }
}