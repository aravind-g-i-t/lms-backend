export interface IDeleteResourceUseCase{
    execute(input:{courseId: string, moduleId: string, chapterId:string, resourceId:string}): Promise<void>
}