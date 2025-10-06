export interface IApplyForBusinessVeficationUseCase {
    execute(id: string):Promise<void>
}