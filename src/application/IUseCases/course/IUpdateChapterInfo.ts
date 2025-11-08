export interface IUpdateChapterInfoUseCase{
    execute(input:{courseId:string;chapterId:string,moduleId:string;title:string;description:string}):Promise<void>
}