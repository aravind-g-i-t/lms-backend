export interface IGetProfilePicUseCase{
    execute(learnerId: string): Promise<string|null>
}