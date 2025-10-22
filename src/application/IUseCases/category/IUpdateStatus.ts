
export interface IUpdateCategoryStatusUseCase{
    execute(id:string):Promise<void>
}