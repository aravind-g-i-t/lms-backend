import { BusinessAsRaw } from "@application/dtos/business/BusinessDTO";
import { IUpdateBusinessDataUseCase } from "@application/IUseCases/business/IUpdateBusinessData";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateBusinessDataUseCase implements IUpdateBusinessDataUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}

    async execute(id: string, update: Partial<BusinessAsRaw>): Promise<void> {
        
        const business=await this._businessRepository.findByIdAndUpdate(id,update);
        if(!business){
            throw new AppError(MESSAGES.BUSINESS_NOT_UPDATED,STATUS_CODES.NOT_MODIFIED)
        }
        return;
    }
}