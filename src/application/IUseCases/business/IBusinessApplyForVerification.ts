export interface IBusinessApplyForVeficationUseCase {
    execute(id: string):Promise<void>
}