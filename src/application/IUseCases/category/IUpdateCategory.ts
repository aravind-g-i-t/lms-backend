import { CategoryForListing } from "@application/dtos/category/categoryDTO";

export interface IUpdateCategoryUseCase{
    execute(update:CategoryForListing):Promise<void>
}