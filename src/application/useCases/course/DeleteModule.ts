import { IDeleteModuleUseCase } from "@application/IUseCases/course/IDeleteModule";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class DeleteModuleUseCase implements IDeleteModuleUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }

    async execute(input: { courseId: string; moduleId: string; }): Promise<void> {

        const { courseId, moduleId } = input;

        const deleted = await this._courseRepository.removeModule({ courseId, moduleId });

        if (!deleted) {
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}