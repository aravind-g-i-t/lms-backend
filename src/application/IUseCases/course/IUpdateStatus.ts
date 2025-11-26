export interface IUpdateCourseStatusUseCase{
    execute(input:{courseId:string;status:string;}):Promise<void>
}