export interface ICancelEnrollmentUseCase{
    execute(input:{courseId:string; learnerId:string}):Promise<void>;
}