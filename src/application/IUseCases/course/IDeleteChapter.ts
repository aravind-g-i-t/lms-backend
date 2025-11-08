export interface IDeleteChaperUseCase{
    execute(input:{courseId: string; moduleId: string; chapterId: string;}):Promise<void>
}

