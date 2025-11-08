export interface IDeleteModuleUseCase{
    execute(input:{courseId:string,moduleId:string}):Promise<void>
};

