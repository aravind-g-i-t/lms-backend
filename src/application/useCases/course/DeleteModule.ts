import { IDeleteModuleUseCase } from "@application/IUseCases/course/IDeleteModule";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class DeleteModuleUseCase implements IDeleteModuleUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }

    async execute(input: { courseId: string; moduleId: string; }): Promise<void> {

        const { courseId, moduleId } = input;
        console.log(courseId,moduleId);
        
        const deleted = await this._courseRepository.removeModule({ courseId, moduleId });
        console.log("deleted",deleted);
        
        if (!deleted) {
            throw new AppError("Failed to delete module.", STATUS_CODES.BAD_REQUEST)
        }
    }
}