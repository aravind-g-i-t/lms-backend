export interface IGetCourseOptionsUseCase{
    execute(input: {instructorId:string}): Promise<{id:string; title:string}[]>
}