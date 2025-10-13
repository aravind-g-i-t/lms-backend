import { BusinessAsRaw } from "@application/dtos/business/BusinessDTO";

export interface IUpdateBusinessDataUseCase{
    execute(id:string,update:Partial<BusinessAsRaw>):Promise<void>
}