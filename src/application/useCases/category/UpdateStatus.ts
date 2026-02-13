
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { IUpdateCategoryStatusUseCase } from "@application/IUseCases/category/IUpdateStatus";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";

export class UpdateCategoryStatusUseCase implements IUpdateCategoryStatusUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.updateCategoryStatus(id);
    if (!category) {
      throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}
