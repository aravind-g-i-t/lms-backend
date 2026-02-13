import { IUpdateCategoryUseCase } from "@application/IUseCases/category/IUpdateCategory";
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";


export class UpdateCategoryUseCase implements IUpdateCategoryUseCase{
  constructor(private _categoryRepository: ICategoryRepository) {}

  async execute(update:{id:string,name:string,description:string,isActive:boolean}): Promise<void> {
    const {id,...data}=update
    const category = await this._categoryRepository.findById(id);
    if (!category) {
      throw new AppError(MESSAGES.CATEGORY_NOT_FOUND,STATUS_CODES.NOT_FOUND);
    }

    const existingCategory = await this._categoryRepository.findOne({name:data.name});
    if (existingCategory && existingCategory.id !== id) {
      throw new AppError(MESSAGES.CATEGORY_EXISTS, STATUS_CODES.CONFLICT);
    }


    const updated = await this._categoryRepository.updateById(id, data);
    if (!updated) {
      throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

  }
}
