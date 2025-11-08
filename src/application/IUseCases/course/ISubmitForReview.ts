export interface ISubmitCourseForReviewUseCase{
    execute(id:string):Promise<void>
}