export interface IUpdateModuleInfoUseCase{
    execute(input:{courseId:string;moduleId:string;title:string;description:string}):Promise<void>
}