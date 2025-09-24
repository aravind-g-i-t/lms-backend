import { Instructor } from "@domain/entities/Instructor";

export interface IUpdateInstructorDataUseCase{
    execute(id:string,update:Partial<Instructor>):Promise<Instructor>
}