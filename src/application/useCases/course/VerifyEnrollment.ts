import { IVerifyEnrollmentUseCase } from "@application/IUseCases/course/IVerifyEnrollment";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class VerifyEnrollmentUseCase implements IVerifyEnrollmentUseCase {
    constructor(
        private _enrollmentRepository: IEnrollmentRepository,
    ) { }

    async execute(input: { learnerId: string; courseId: string }): Promise<void> {

        const { courseId, learnerId } = input;

        const isEnrolled = await this._enrollmentRepository.findOne({ courseId, learnerId, status: EnrollmentStatus.Active });
        if (!isEnrolled) {
            throw new AppError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED)
        }

    }
}