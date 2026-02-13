

import { CourseAnalyticsDTO, GetCourseAnalyticsInput, IGetCourseAnalyticsUseCase } from "@application/IUseCases/course/IGetCourseAnalytics";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";

export class GetCourseAnalyticsUseCaseImpl
    implements IGetCourseAnalyticsUseCase {
    constructor(
        private readonly enrollmentRepo: IEnrollmentRepository,
        private readonly progressRepo: ILearnerProgressRepository,
    ) { }

    async execute({
        courseId,
        // timeRange,
    }: GetCourseAnalyticsInput): Promise<CourseAnalyticsDTO> {


        // const now = new Date();
        // const fromDate =
        //     timeRange === "7d"
        //         ? new Date(now.setDate(now.getDate() - 7))
        //         : timeRange === "30d"
        //             ? new Date(now.setDate(now.getDate() - 30))
        //             : timeRange === "90d"
        //                 ? new Date(now.setDate(now.getDate() - 90))
        //                 : new Date(0);

        /* ------------------ Enrollment stats ------------------ */
        const [
            totalEnrollments,
            activeEnrollments,
            completedEnrollments
            // enrollmentTrend,
        ] = await Promise.all([
            this.enrollmentRepo.getCount({
                courseId,
            }),
            this.enrollmentRepo.getCount({
                courseId,
                status: EnrollmentStatus.Active
            }),
            this.enrollmentRepo.getCount({
                courseId,
                completedAt:{$ne:null}
            })
            // this.enrollmentRepo.getEnrollmentTrend(courseId, fromDate),
        ]);

        const completionRate =
            totalEnrollments === 0
                ? 0
                : (completedEnrollments / totalEnrollments) * 100;


        const averageProgress= await this.progressRepo.getAverageProgress(courseId);


        const enrollmentList=await this.enrollmentRepo.findHydratedEnrollments({
            
            filter:{
                status:EnrollmentStatus.Active,
                courseId
            },
            limit:5,
            page:1
        });
        const recentEnrollments =enrollmentList.enrollments
            
        

        return {
            

            enrollmentStats: {
                total: totalEnrollments,
                active: activeEnrollments,
                completed: completedEnrollments,
                completionRate,
                // trend: enrollmentTrend.map((t) => ({
                //     date: t.date,
                //     enrollments: t.enrollments,
                //     revenue: t.revenue,
                // })),
            },

            progressStats: {
                averageProgress,
            },



            recentEnrollments: recentEnrollments.map((e) => ({
                learnerId: e.learnerId.id,
                learnerName: e.learnerId.name,
                enrolledAt: e.enrolledAt!,
                progressPercentage: e.progressId?.progressPercentage as number,
            })),
        };
    }
}
