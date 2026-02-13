export interface AdminSigninInputDTO{
    email:string,
    password:string
}

export interface AdminSigninOutputDTO{
    id:string;
    email:string;
    accessToken:string;
    refreshToken:string;
}
