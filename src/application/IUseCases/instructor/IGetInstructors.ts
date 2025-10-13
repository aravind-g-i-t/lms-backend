import { GetInstructorsInput, GetInstructorsOutput } from "@application/dtos/instructor/GetInstructors";









export interface IGetInstructorsUseCase{
    execute(input:GetInstructorsInput):Promise<GetInstructorsOutput>
}