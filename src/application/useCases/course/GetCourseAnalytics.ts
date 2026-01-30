

// import { CourseAnalyticsDTO, GetCourseAnalyticsInput, IGetCourseAnalyticsUseCase } from "@application/IUseCases/course/IGetCourseAnalytics";
// import { EnrollmentStatus } from "@domain/entities/Enrollment";
// import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
// import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
// import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
// import { IQuizRepository } from "@domain/interfaces/IQuizRepository";

// export class GetCourseAnalyticsUseCaseImpl
//     implements IGetCourseAnalyticsUseCase {
//     constructor(
//         private readonly courseRepo: ICourseRepository,
//         private readonly enrollmentRepo: IEnrollmentRepository,
//         private readonly progressRepo: ILearnerProgressRepository,
//         private readonly quizRepo: IQuizRepository
//     ) { }

//     async execute({
//         courseId,
//         timeRange,
//     }: GetCourseAnalyticsInput): Promise<CourseAnalyticsDTO> {
//         const course = await this.courseRepo.findById(courseId);
//         if (!course) throw new Error("Course not found");

//         /* ------------------ Time range ------------------ */
//         const now = new Date();
//         const fromDate =
//             timeRange === "7d"
//                 ? new Date(now.setDate(now.getDate() - 7))
//                 : timeRange === "30d"
//                     ? new Date(now.setDate(now.getDate() - 30))
//                     : timeRange === "90d"
//                         ? new Date(now.setDate(now.getDate() - 90))
//                         : new Date(0);

//         /* ------------------ Enrollment stats ------------------ */
//         const [
//             totalEnrollments,
//             activeEnrollments,
//             completedEnrollments,
//             enrollmentTrend,
//         ] = await Promise.all([
//             this.enrollmentRepo.getCount({
//                 courseId,
//             }),
//             this.enrollmentRepo.getCount({
//                 courseId,
//                 status: EnrollmentStatus.Active
//             }),
//             this.enrollmentRepo.getCount({
//                 courseId,
//                 completedAt:{$ne:null}
//             }),
//             this.enrollmentRepo.getEnrollmentTrend(courseId, fromDate),
//         ]);

//         const completionRate =
//             totalEnrollments === 0
//                 ? 0
//                 : (completedEnrollments / totalEnrollments) * 100;

//         /* ------------------ Progress stats ------------------ */
//         const [averageProgress, moduleAnalytics] = await Promise.all([
//             this.progressRepo.getAverageProgress(courseId),
//             this.progressRepo.getModuleAnalytics(courseId),
//         ]);

//         /* ------------------ Quiz stats ------------------ */
//         // const quiz = await this.quizRepo.getQuizStats(courseId);

//         // const quizStats = quiz
//         //     ? {
//         //         ...quiz,
//         //         passRate:
//         //             quiz.totalAttempts === 0
//         //                 ? 0
//         //                 : (quiz.passed / quiz.totalAttempts) * 100,
//         //     }
//         //     : null;

//         /* ------------------ Recent enrollments ------------------ */

//         const enrollmentList=await this.enrollmentRepo.findHydratedEnrollments({
//             filter:{
//                 status:EnrollmentStatus.Active,
//             },
//             limit:5
//         });
//         const recentEnrollments =enrollmentList.enrollments
            
        

//         /* ------------------ DTO mapping ------------------ */
//         return {
//             course: {
//                 id: course.id,
//                 title: course.title,
//                 level: course.level,
//                 status: course.status,
//                 price: course.price,
//                 thumbnail: course.thumbnail,
//                 rating: course.rating,
//                 totalRatings: course.totalRatings,
//                 ratingDistribution: course.ratingDistribution,
//             },

//             enrollmentStats: {
//                 total: totalEnrollments,
//                 active: activeEnrollments,
//                 completed: completedEnrollments,
//                 completionRate,
//                 trend: enrollmentTrend.map((t) => ({
//                     date: t.date,
//                     enrollments: t.enrollments,
//                     revenue: t.revenue,
//                 })),
//             },

//             progressStats: {
//                 averageProgress,
//                 moduleAnalytics,
//             },



//             recentEnrollments: recentEnrollments.map((e) => ({
//                 learnerId: e.learnerId.id,
//                 learnerName: e.learnerId.name,
//                 enrolledAt: e.enrolledAt!,
//                 progressPercentage: 0, // can be filled via progressRepo if needed
//             })),
//         };
//     }
// }
