import { IGetAdminDashboardOutputDTO, IGetAdminDashboardUseCase } from "@application/IUseCases/admin/IGetAdminDashboard";
import { Course } from "@domain/entities/Course";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IPaymentRepository, MonthlyRevenue } from "@domain/interfaces/IPaymentRepository";
import { getLastNMonthsRange } from "shared/utils/hash";

export class GetAdminDashboardUseCase implements IGetAdminDashboardUseCase {
    constructor(
        private _enrollmentRepository: IEnrollmentRepository,
        private _learnerRepository: ILearnerRepository,
        private _instructorRepository: IInstructorRepository,
        private _courseRepository: ICourseRepository,
        private _paymentRepository: IPaymentRepository,
        private _fileStorageService: IFileStorageService,
    ) { }

    async execute(): Promise<IGetAdminDashboardOutputDTO> {
        const learnerList = await this._learnerRepository.findAll({
            isActive: true,
        }, { page: 1, limit: 1 })
        const instructorList = await this._instructorRepository.findAll({
            isActive: true,
            "verification.status": "Verified"
        }, { page: 1, limit: 1 })

        const activeInstructors = instructorList.totalCount;
        const activeLearners = learnerList.totalCount;




        const totalCourses = await this._courseRepository.getCount({});

        const courseList = await this._courseRepository.findAllCourses({
            pagination: {
                page: 1,
                limit: 5
            },
            sort: {
                rating: "desc",
                enrollmentCount: "desc"
            } as Record<keyof Course, "asc" | "desc">
        })
        const topCourses = courseList.courses.map(course => {
            return {
                id: course.id,
                title: course.title,
                enrollmentCount: course.enrollmentCount,
                rating: course.rating
            }
        })
        const { startDate, endDate } = getLastNMonthsRange(12)
        const revenue = await this._paymentRepository.getMonthlyCourseRevenue(startDate, endDate);

        const monthlyRevenue = this.fillMissingMonths(revenue, startDate, endDate)
        const totalRevenue = await this._paymentRepository.getTotalRevenue();

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newLearnersThisMonth = await this._learnerRepository.countCreatedAfter(startOfMonth);

        const newInstructorsThisMonth= await this._instructorRepository.countCreatedAfter(startOfMonth);

        const totalEnrollments= await this._enrollmentRepository.getCount({
            status:EnrollmentStatus.Active
        })

        const instructors= await this._enrollmentRepository.getTopInstructorsByEnrollments(5);


        const topInstructors = await Promise.all(instructors.map(async instructor => {
            const profilePic = instructor.profilePic?await this._fileStorageService.getViewURL(instructor.profilePic): null;
            return {...instructor, profilePic}
        }));

        const stats = {
            activeLearners,
            activeInstructors,
            totalCourses,
            totalRevenue,
            newInstructorsThisMonth,
            newLearnersThisMonth,
            totalEnrollments
        }

        return {
            topCourses,
            topInstructors,
            stats,
            monthlyRevenue,
        }

    }

    private fillMissingMonths = (
        results: MonthlyRevenue[],
        startDate: Date,
        endDate: Date
    ): MonthlyRevenue[] => {

        const map = new Map(
            results.map(r => [`${r.year}-${r.month}`, r])
        );

        const filled: MonthlyRevenue[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1;

            const key = `${year}-${month}`;

            filled.push(
                map.get(key) ?? {
                    year,
                    month,
                    totalGrossAmount: 0,
                    instructorShare: 0,
                    companyRevenue: 0
                }
            );

            current.setMonth(current.getMonth() + 1);
        }

        return filled;
    }
}