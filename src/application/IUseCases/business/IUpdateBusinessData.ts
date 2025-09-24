import { Business } from "@domain/entities/Business";

export interface IUpdateBusinessDataUseCase{
    execute(id:string,update:Partial<Business>):Promise<Business>
}