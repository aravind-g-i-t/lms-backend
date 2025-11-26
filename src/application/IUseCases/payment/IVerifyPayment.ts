export interface IVerifyPaymentUseCase{
    execute(sessionId:string):Promise<{status:string}>
}