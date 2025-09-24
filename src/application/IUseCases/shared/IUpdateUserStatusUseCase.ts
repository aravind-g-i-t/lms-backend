export interface IUpdateUserStatusUseCase{
    execute(id:string):Promise<void>
}