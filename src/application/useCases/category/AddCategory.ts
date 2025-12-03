
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
            isActive: data.isActive
        };

        const existingCategory = await this._categoryRepository.findByName(data.name);
        if (existingCategory) {
            throw new AppError("Another category with this name already exists", STATUS_CODES.CONFLICT);
        }


        const newCategory = await this._categoryRepository.createCategory(category);
        return CategoryDTOMapper.toCategoryForListing(newCategory)
    }
}
