export interface IUpdateInstructorVerificationStatusUseCase{
    execute(input:{id:string,status:string,remarks:string|null}):Promise<void>;
}