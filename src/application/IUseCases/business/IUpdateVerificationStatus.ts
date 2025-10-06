export interface IUpdateBusinessVerificationStatusUseCase{
    execute(input:{id:string,status:string,remarks:string|null}):Promise<void>;
}