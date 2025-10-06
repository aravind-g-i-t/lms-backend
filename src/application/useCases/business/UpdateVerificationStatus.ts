import { IUpdateBusinessVerificationStatusUseCase } from "@application/IUseCases/business/IUpdateVerificationStatus";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateBusinessVerificationStatusUseCase implements IUpdateBusinessVerificationStatusUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}

    async execute(input: {id:string; status: "Verified"|"Rejected"; remarks: string|null; }): Promise<void> {
        const {id,status,remarks}=input;
        const verification={
            status,
            remarks
        };
        const updatedBusiness=await this._businessRepository.findByIdAndUpdate(id,{verification})
        if(!updatedBusiness){
            throw new AppError(MESSAGES.BUSINESS_NOT_UPDATED,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}