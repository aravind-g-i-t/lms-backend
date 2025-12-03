
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { IUpdateCategoryStatusUseCase } from "@application/IUseCases/category/IUpdateStatus";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";

export class UpdateCategoryStatusUseCase implements IUpdateCategoryStatusUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.updateCategoryStatus(id);
    if (!category) {
      throw new AppError("Failed to update category status",STATUS_CODES.NOT_MODIFIED);
    }
  }
}
