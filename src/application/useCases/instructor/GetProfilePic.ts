import { IGetProfilePicUseCase } from "@application/IUseCases/shared/IGetProfilePic";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetInstructorProfilePicUseCase implements IGetProfilePicUseCase {
    constructor(
        private _instructorRepository: IInstructorRepository,
    ) { }
    async execute(instructorId: string): Promise<string|null> {
        const instructor = await this._instructorRepository.findById(instructorId);
        if (!instructor) {
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }
        return instructor.profilePic
    }

}