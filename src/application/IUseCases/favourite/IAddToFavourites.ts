export interface IAddtoFavouritesUseCase{
    execute(input:{courseId:string,learnerId:string}):Promise<void>
}