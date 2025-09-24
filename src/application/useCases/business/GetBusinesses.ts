
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { GetBusinessesInput, GetBusinessesOutput, IGetBusinessesUseCase } from "@application/IUseCases/business/IGetBusinesses";



export class GetBusinessesUseCase implements IGetBusinessesUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}

    async execute(input:GetBusinessesInput):Promise<GetBusinessesOutput>{
        const result=await this._businessRepository.findAll(input);
        
        const {businesses,totalPages,totalCount}=result;
        
        return {businesses,totalPages,totalCount}
    }
}