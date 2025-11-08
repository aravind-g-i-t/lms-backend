export interface IGetCategoryOptionsUseCase{
    execute():Promise<{id:string;name:string;}[]>
}