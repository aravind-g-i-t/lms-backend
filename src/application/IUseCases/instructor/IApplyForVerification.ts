export interface IInstructorApplyForVeficationUseCase {
    execute(id: string):Promise<void>
}