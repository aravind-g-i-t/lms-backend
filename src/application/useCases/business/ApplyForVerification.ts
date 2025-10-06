import { IApplyForBusinessVeficationUseCase } from "@application/IUseCases/business/IBusinessApplyForVerification";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class ApplyForBusinessVerificationUseCase implements IApplyForBusinessVeficationUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}

    async execute(id: string): Promise<void> {
        const business =await this._businessRepository.findById(id);
        if(!business){
            throw new AppError(MESSAGES.BUSINESS_NOT_FOUND,STATUS_CODES.NOT_FOUND,false)
        }
        if(!business.name|| !business.businessDomain||!business.website|| !business.location || !business.license){
            throw new AppError(MESSAGES.INCOMPLETE_PROFILE,STATUS_CODES.BAD_REQUEST)
        }
        const updated=await this._businessRepository.findByIdAndUpdate(id,{verification:{
            status:"Under Review",
            remarks:null
        }})
        if(!updated){
            throw new AppError(MESSAGES.SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}