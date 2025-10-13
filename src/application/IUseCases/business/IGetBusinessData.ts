import { GetBusinessDataOutputDTO } from "@application/dtos/business/GetBusinessData";

export interface IGetBusinessDataUseCase{
    execute(id:string):Promise<GetBusinessDataOutputDTO>
}