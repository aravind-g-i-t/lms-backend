export interface SignupInputDTO{
    name:string;
    email:string;
    password:string;
    role:string;
}


export interface SignupOutputDTO{
    email:string;
    otpExpiresAt:Date;
    role:string;
}