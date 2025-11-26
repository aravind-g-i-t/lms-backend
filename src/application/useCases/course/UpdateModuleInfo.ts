import { IUpdateModuleInfoUseCase } from "@application/IUseCases/course/IUpdateModuleInfo";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateModuleInfoUseCase implements IUpdateModuleInfoUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }
    async execute(input: { courseId: string; moduleId: string; title: string; description: string; }): Promise<void> {
        const { courseId, moduleId, title, description } = input;
        const updated = await this._courseRepository.updateModuleInfo({ courseId, moduleId, updates: { title, description } })
        if (!updated) {
            throw new AppError("Failed to update video.", STATUS_CODES.BAD_REQUEST)
        }
    }
}