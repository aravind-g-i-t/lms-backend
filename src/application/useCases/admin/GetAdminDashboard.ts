import { IGetAdminDashboardOutputDTO, IGetAdminDashboardUseCase } from "@application/IUseCases/admin/IGetAdminDashboard";
import { Course } from "@domain/entities/Course";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { getLastNMonthsRange } from "shared/utils/hash";

export class GetAdminDashboardUseCase implements IGetAdminDashboardUseCase{
    constructor(
        private _enrollmentRepository:IEnrollmentRepository,
        private _learnerRepository:ILearnerRepository,
        private _instructorRepository:IInstructorRepository,
        private _courseRepository:ICourseRepository,
        private _paymentRepository:IPaymentRepository
    ){}

    async execute(): Promise<IGetAdminDashboardOutputDTO> {
        const learnerList= await this._learnerRepository.findAll({
            isActive:true,
        },{page:1,limit:1})
        const instructorList= await this._instructorRepository.findAll({
            isActive:true,
            "verification.status":"Verified"
        },{page:1,limit:1})

        const activeInstructors=instructorList.totalCount;
        const activeLearners=learnerList.totalCount;

        const enrollmentList= await this._enrollmentRepository.findHydratedEnrollments({
            filter:{
                status:EnrollmentStatus.Active,
            },
            limit:5,
            page:1
        });
        const recentEnrollments= enrollmentList.enrollments.map(enrollment=>{
            const amount=enrollment.paymentId.paidAmount-(enrollment.paymentId.grossAmount*70/100);
            return {
                id:enrollment.id,
                learner:{
                    id:enrollment.learnerId.id,
                    name:enrollment.learnerId.name
                },
                course:{
                    id:enrollment.courseId,
                    title:enrollment.courseTitle
                },
                amount,
                enrolledAt:enrollment.enrolledAt
            }
        })

        const totalCourses= await this._courseRepository.getCount({});

        const courseList= await this._courseRepository.findAllCourses({
            pagination:{
                page:1,
                limit:5
            },
            sort:{
                rating:"desc",
                enrollmentCount:"desc"
            } as Record<keyof Course, "asc" | "desc">
        })
        const topCourses=courseList.courses.map(course=>{
            return {
                id:course.id,
                title:course.title,
                enrollmentCount:course.enrollmentCount,
                rating:course.rating
            }
        })
        const {startDate,endDate}=getLastNMonthsRange(12)
        const revenueData=await this._paymentRepository.getMonthlyCourseRevenue(startDate,endDate)


        const stats={
            activeLearners,
            activeInstructors,
            totalCourses
        }

        return {
            recentEnrollments,
            topCourses,
            stats,
            revenueData

        }
        
    }
}