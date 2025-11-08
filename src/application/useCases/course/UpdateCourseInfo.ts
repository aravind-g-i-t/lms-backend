import { IUpdateCourseUseCase } from "@application/IUseCases/course/IUpdateCourse";
import { Course } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateCourseUseCase implements IUpdateCourseUseCase{
    constructor(
        private _courseRepository:ICourseRepository
    ){}

    async execute(id: string, updates: Partial<Course>): Promise<void> {
        console.log("updates",updates);
        
        const updated=await this._courseRepository.update({
            id,
            updates
        });
        console.log("updated",updated);
        if(!updated){
            throw new AppError("Failed to update course.",STATUS_CODES.BAD_REQUEST)
        }
    }
}