
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { GetBusinessesInput, GetBusinessesOutput } from "./types";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";



export class GetBusinessesUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}

    async execute(input:GetBusinessesInput):Promise<GetBusinessesOutput>{
        const result=await this._businessRepository.findAll(input);
        
        const {businesses,totalPages,totalCount}=result;
        
        return {businesses,totalPages,totalCount}
    }
}