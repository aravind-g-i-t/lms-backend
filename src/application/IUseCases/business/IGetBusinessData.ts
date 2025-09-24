import { Business } from "@domain/entities/Business";

export interface IGetBusinessDataUseCase{
    execute(id:string):Promise<Business>
}