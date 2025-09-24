export interface IVerifyEmailUseCase{
    execute(email:string,role:string):Promise<Date>
}