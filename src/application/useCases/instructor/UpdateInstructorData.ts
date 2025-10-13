import { InstructorAsRaw } from "@application/dtos/instructor/InstructorDTO";
import { IUpdateInstructorDataUseCase } from "@application/IUseCases/instructor/IUpdateInstructorData";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateInstructorDataUseCase implements IUpdateInstructorDataUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(id: string, update: Partial<InstructorAsRaw>): Promise<void> {
        const instructor=await this._instructorRepository.findByIdAndUpdate(id,update);
        if(!instructor){
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_UPDATED,STATUS_CODES.NOT_MODIFIED)
        }
        return;
    }
}