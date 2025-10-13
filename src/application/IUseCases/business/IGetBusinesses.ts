
import { GetBusinessesInput, GetBusinessesOutput } from "@application/dtos/business/GetBusinesses";


export interface IGetBusinessesUseCase{
    execute(input:GetBusinessesInput):Promise<GetBusinessesOutput>
}