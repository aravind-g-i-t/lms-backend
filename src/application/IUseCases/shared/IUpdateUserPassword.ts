export interface IUpdateUserPassword{
    execute(id:string,currentPassword:string,newPassword:string):Promise<void>
}