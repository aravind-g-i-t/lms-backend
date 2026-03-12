export interface IGetUnreadMessagesCountUseCase{
    execute(input:{role:string,id:string}):Promise<number>
}