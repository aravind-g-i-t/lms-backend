import { IUpdateCategoryUseCase } from "@application/IUseCases/category/IUpdateCategory";
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";


export class UpdateCategoryUseCase implements IUpdateCategoryUseCase{
  constructor(private _categoryRepository: ICategoryRepository) {}

  async execute(update:{id:string,name:string,description:string,isActive:boolean}): Promise<void> {
    const {id,...data}=update
    const category = await this._categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Category not found",STATUS_CODES.NOT_FOUND);
    }

    const existingCategory = await this._categoryRepository.findByName(data.name);
    if (existingCategory && existingCategory.id !== id) {
      throw new AppError("Another category with this name already exists", STATUS_CODES.CONFLICT);
    }


    const updated = await this._categoryRepository.updateCategory(id, data);
    if (!updated) {
      throw new AppError("Failed to update category",STATUS_CODES.NOT_MODIFIED);
    }

  }
}
