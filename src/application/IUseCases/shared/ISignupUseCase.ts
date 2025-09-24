


export interface IUserSignupUseCase {
    execute(signupInput:{name:string,email:string,password:string,role:string}):Promise<{email:string,otpExpiresAt:Date,role:string}>

    isBusinessEmail(email: string): boolean;
}