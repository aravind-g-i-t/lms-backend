import { IGetLearnerEnrollmentsForInstructorUseCase, LearnerEnrollmentsOutputDTO } from "@application/IUseCases/enrollment/IGetLearnerEnrollmentsForInstructor";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetLearnerEnrollmentsUseCase implements IGetLearnerEnrollmentsForInstructorUseCase {
    constructor(
        private _enrollmentRepository: IEnrollmentRepository,
        private _fileStorageService: IFileStorageService
    ) { }

    async execute(input: { instructorId: string; page: number; limit: number; search?: string; }): Promise<{learners:LearnerEnrollmentsOutputDTO[],total:number}> {
        const { instructorId, page, limit, search } = input;
        const result = await this._enrollmentRepository.findLearnerEnrollmentsForInstructor({
            instructorId,
            page,
            search,
            limit
        });



        try {
            const learnerEnrollments = await Promise.all(
                result.data.map(async (item) => {
                    const profilePic = item.learner.profilePic
                        ? await this._fileStorageService.getViewURL(item.learner.profilePic)
                        : null;

                    const enrollments = await Promise.all(
                        item.enrollments.map(async (enrollment) => ({
                            ...enrollment,
                            thumbnail: enrollment.thumbnail
                                ? await this._fileStorageService.getViewURL(enrollment.thumbnail)
                                : null,
                        }))
                    );

                    return {
                        ...item,
                        learner: {
                            ...item.learner,
                            profilePic,
                        },
                        enrollments,
                    };
                })
            );

            console.log("Enrollments", learnerEnrollments);
            return {learners:learnerEnrollments,total:result.total};

        } catch (error) {
            console.error(" Error while building learnerEnrollments:", error);
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR);
        }

    }
}