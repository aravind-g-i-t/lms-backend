export interface IGetVideoUseCase{
    execute(input:{learnerId:string; courseId:string; moduleId:string; chapterId:string}):Promise<string>
}