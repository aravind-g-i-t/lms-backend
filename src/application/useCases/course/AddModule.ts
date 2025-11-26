import { AddModuleOutput } from "@application/dtos/course/AddModule";
import { IAddModuleUseCase } from "@application/IUseCases/course/IAddModule";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";
import { IdGenerator } from "shared/utils/IdGenerator";

export class AddModuleUseCase implements IAddModuleUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }

    async execute(id: string, module: { title: string; description: string; }): Promise<AddModuleOutput> {
        const newModule = {
            id: IdGenerator.generate(),
            title: module.title,
            description: module.description,
            duration: 0,
            chapters: []
        }
        const updated = await this._courseRepository.addModule({
            courseId: id,
            module: newModule
        });
        if (!updated) {
            throw new AppError("Failed to add module.", STATUS_CODES.BAD_REQUEST)
        }
        return newModule;
    }
};



