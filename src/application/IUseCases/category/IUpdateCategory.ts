import { CategoryForListing } from "@application/dtos/category/CategoryDTO";

export interface IUpdateCategoryUseCase{
    execute(update:CategoryForListing):Promise<void>
}