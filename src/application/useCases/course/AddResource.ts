import { IAddResourceUseCase } from "@application/IUseCases/course/IAddResource";
import { Resource } from "@domain/entities/Course";

import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";
import { IdGenerator } from "shared/utils/IdGenerator";

export class AddResourceUseCase implements IAddResourceUseCase  {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IS3Service,
    ) { }

    async execute(input:{courseId: string, moduleId: string, chapterId:string, resource: { name: string; size: number; file: string; }}): Promise<Resource> {

        const newResource = {
            id: IdGenerator.generate(),
            name: input.resource.name,
            size: input.resource.size,
            file: input.resource.file,
        }
        const updated = await this._courseRepository.addResource({
            courseId:input.courseId,
            moduleId:input.moduleId,
            chapterId:input.chapterId,
            resource:newResource
        });

        if (!updated) {
            throw new AppError("Failed to add module.", STATUS_CODES.BAD_REQUEST)
        }
        const file = await this._fileStorageService.getDownloadUrl(input.resource.file);
        return { ...newResource, file };

    }

};



