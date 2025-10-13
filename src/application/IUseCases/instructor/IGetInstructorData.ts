import { GetInstructorDataOutputDTO } from "@application/dtos/instructor/GetInstructorData";

export interface IGetInstructorDataUseCase{
    execute(id:string):Promise<GetInstructorDataOutputDTO>
}