

export interface IAdminSigninUseCase{
    execute(input:{email:string,password:string}):Promise<{id:string,email:string,accessToken:string,refreshToken:string}>
}
