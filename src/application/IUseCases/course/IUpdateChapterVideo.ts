export interface IUpdateChapterVideoUseCase{
    execute(input:{courseId:string;chapterId:string,moduleId:string;video:string;duration:number}):Promise<void>
};
