export interface IRemoveFromFavouritesUseCase{
    execute(input:{courseId:string,learnerId:string}):Promise<void>
}