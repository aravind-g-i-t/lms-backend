import {
    EnrollmentsForLearnerListing,
    GetEnrollmentsOutput
} from "@application/dtos/enrollment/GetEnrollments";

import { IGetEnrollmentsUseCase } from "@application/IUseCases/enrollment/IGetEnrollments";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";

export class GetEnrollmentsUseCase implements IGetEnrollmentsUseCase {

    constructor(
        private _enrollmentRepository: IEnrollmentRepository,
        private _learnerProgressRepository: ILearnerProgressRepository,
        private _storageService: IFileStorageService
    ) { }

    async execute(input: {
        learnerId: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<GetEnrollmentsOutput> {

        const {
            learnerId,
            search = "",
            page = 1,
            limit = 10
        } = input;

        // 1. Fetch enrollments with pagination
        const result = await this._enrollmentRepository.findPaginatedEnrollments({
            learnerId,
            search,
            page,
            limit,
            filter: {
                status: [EnrollmentStatus.Active]
            }
        });

        const enrollments = result.data;
        const total = result.total;

        // 2. Fetch progress for all enrolled courses
        const progresses = await this._learnerProgressRepository.findManyByCourseIds(
            learnerId,
            enrollments.map(e => e.courseId)
        );

        // Convert progress list into fast lookup
        const progressMap = new Map(
            progresses.map(p => [p.courseId, p])
        );

        const finalData: EnrollmentsForLearnerListing[] = await Promise.all(
            enrollments.map(async (enrollment) => {
                const progress = progressMap.get(enrollment.courseId);

                const thumbnailUrl = enrollment.thumbnail
                    ? await this._storageService.getViewURL(enrollment.thumbnail)
                    : null;

                return {
                    id: enrollment.id,
                    courseTitle: enrollment.courseTitle,
                    courseId:enrollment.courseId,
                    thumbnail: thumbnailUrl,
                    instructor: {
                        id: enrollment.instructorId,
                        name: enrollment.instructorName
                    },
                    progressPercentage: progress?.progressPercentage ?? 0,
                    totalChapters: progress?.totalChapters ?? 0,
                    completedChapters: progress?.completedChapters.length ?? 0,
                    lastAccessedAt: progress?.lastAccessedAt ?? null,
                    enrolledAt: enrollment.enrolledAt as Date,
                    duration: enrollment.duration
                };
            })
        );

        return {
            data: finalData,
            total
        };
    }
}
