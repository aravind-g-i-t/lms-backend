export interface IUpdateCurrentChapterUseCase{
    execute(input:{learnerId:string; courseId:string;chapterId:string}):Promise<void>
}