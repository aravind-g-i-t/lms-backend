export interface IUserOTPVerificationUseCase {
    execute(input: {email:string,otp:string}):Promise<void>   
}