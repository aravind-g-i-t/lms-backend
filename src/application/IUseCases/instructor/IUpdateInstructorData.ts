import { InstructorAsRaw } from "@application/dtos/instructor/InstructorDTO";

export interface IUpdateInstructorDataUseCase{
    execute(id:string,update:Partial<InstructorAsRaw>):Promise<void>
}