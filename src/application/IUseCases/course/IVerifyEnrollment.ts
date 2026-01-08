export interface IVerifyEnrollmentUseCase{
    execute(input:{learnerId:string; courseId:string}):Promise<void>
}