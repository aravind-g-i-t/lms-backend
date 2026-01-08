
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { IAddCategoryUseCase } from "@application/IUseCases/category/IAddCategory";
import { CategoryDTOMapper } from "@application/mappers/CategoryMapper";
import { CategoryForListing } from "@application/dtos/category/CategoryDTO";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";

export class AddCategoryUseCase implements IAddCategoryUseCase {
    constructor(private _categoryRepository: ICategoryRepository) { }

    async execute(data: { name: string; description: string; isActive: boolean }): Promise<CategoryForListing> {

        const category = {
            name: data.name,
            description: data.description,
            isActive: data.isActive??false
        };

        const existingCategory = await this._categoryRepository.findOne({name:category.name});
        if (existingCategory) {
            throw new AppError("Another category with this name already exists", STATUS_CODES.CONFLICT);
        }


        const newCategory = await this._categoryRepository.create(category);
        if(!newCategory){
            throw new AppError("Failed to create new category.",STATUS_CODES.BAD_REQUEST)
        }
        return CategoryDTOMapper.toCategoryForListing(newCategory)
    }
}
