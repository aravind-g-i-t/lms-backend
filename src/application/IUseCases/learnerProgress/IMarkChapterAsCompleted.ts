export interface IMarkChapterAsCompletedUseCase{
    execute(input:{learnerId:string; courseId:string; chapterId:string}):Promise<void>
}