import { IGetBusinessDataUseCase } from "@application/IUseCases/business/IGetBusinessData";
import { Business } from "@domain/entities/Business";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetBusinessDataUseCase implements IGetBusinessDataUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}
    async execute(id: string): Promise<Business> {
        const user=await this._businessRepository.findById(id,true);
        if(!user){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        return user;
    }
}