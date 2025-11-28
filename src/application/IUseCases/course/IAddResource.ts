import { Resource } from "@domain/entities/Course";

export interface IAddResourceUseCase{
    execute(input:{courseId: string, moduleId: string, chapterId:string, resource:{name:string; size:number; file:string}}): Promise<Resource>
}