import { GetInstructorDashboardOutputDTO, IGetInstructorDashboardUseCase } from "@application/IUseCases/instructor/IGetInstructorDashboard";
import { Course } from "@domain/entities/Course";
import { LiveSessionStatus } from "@domain/entities/LiveSession";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetInstructorDashboardUseCase implements IGetInstructorDashboardUseCase {
    constructor(
        private _courseReposiitory: ICourseRepository,
        private _liveSessionRepository: ILiveSessionRepository,
        private _instructorWalletRepository: IInstructorWalletRepository,
        private _fileStorageService: IFileStorageService
    ) { }

    async execute(instructorId: string): Promise<GetInstructorDashboardOutputDTO> {
        const result = await this._courseReposiitory.findAllCourses({
            sort: { rating: "desc", enrollmentCount: "desc" } as Record<keyof Course, "asc" | "desc">,
            pagination: {
                page: 1,
                limit: 3
            },
            filter: {
                instructorIds: [instructorId]
            }
        })
        const topCourses = await Promise.all(
            result.courses.map(async (course) => {
                return {
                    id: course.id,
                    title: course.title,
                    enrollmentCount: course.enrollmentCount,
                    rating: course.rating,
                    thumbnail: await this._fileStorageService.getViewURL(course.thumbnail as string),

                }
            })
        )

        const sessionList = await this._liveSessionRepository.findManyWithPagination({
            status: LiveSessionStatus.Scheduled,
            search: "",
            limit: 5,
            page: 1,
            filter: { instructorId }
        })

        const upcomingSessions = sessionList.sessions;
        const allCourses = await this._courseReposiitory.findMany({
            instructorId,
        });
        const totalCourses = allCourses.length;
        let totalEnrollments = 0;
        let totalRatings = 0;
        let ratingSum = 0;
        let ratingCount=0
        for (let i = 0; i < totalCourses; i++) {
            totalEnrollments += allCourses[i].enrollmentCount;
            ratingSum += allCourses[i].rating || 0;
            totalRatings += allCourses[i].totalRatings;
            ratingCount+=(allCourses[i].rating)?1:0
        }
        const instructorWallet = await this._instructorWalletRepository.findByInstructorId(instructorId);

        if(!instructorWallet){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }

        const stats = {
            totalCourses,
            totalEnrollments,
            totalEarnings: instructorWallet?.availableBalance,
            pendingEarnings: instructorWallet?.pendingBalance,
            averageRating: ratingSum / ratingCount,
            totalRatings,
            upcomingLiveSessions: sessionList.totalCount
        }

        return {
            stats,
            upcomingSessions,
            topCourses
        }

    }
}