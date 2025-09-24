import { Instructor } from "@domain/entities/Instructor";

export interface IGetInstructorDataUseCase{
    execute(id:string):Promise<Instructor>
}