import { AddChapterOutput } from "@application/dtos/course/AddChapter";

export interface IAddChapterUseCase{
    execute(courseId:string,moduleId: string,chapter:{title:string;description:string,video:string,duration:number}):Promise<AddChapterOutput>
}