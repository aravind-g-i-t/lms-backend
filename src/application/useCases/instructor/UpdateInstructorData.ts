import { IUpdateInstructorDataUseCase } from "@application/IUseCases/instructor/IUpdateInstructorData";
import { Instructor } from "@domain/entities/Instructor";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateInstructorDataUseCase implements IUpdateInstructorDataUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(id: string, update: Partial<Instructor>): Promise<Instructor> {
        const instructor=await this._instructorRepository.findByIdAndUpdate(id,update);
        if(!instructor){
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_UPDATED,STATUS_CODES.NOT_MODIFIED)
        }
        return instructor;
    }
}