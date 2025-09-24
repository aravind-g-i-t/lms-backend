export interface IResetPasswordUseCase{
    execute(role:string,email: string, password: string):Promise<void>
}