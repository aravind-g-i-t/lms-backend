
import { IDeleteResourceUseCase } from "@application/IUseCases/course/IDeleteResource";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class DeleteResourceUseCase implements IDeleteResourceUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
    ) { }

    async execute(input:{courseId: string, moduleId: string, chapterId:string, resourceId:string}): Promise<void> {

        const updated = await this._courseRepository.removeResource({
            courseId:input.courseId,
            moduleId:input.moduleId,
            chapterId:input.chapterId,
            resourceId:input.resourceId
        });

        if (!updated) {
            throw new AppError("Failed to add module.", STATUS_CODES.BAD_REQUEST)
        }

    }

};



