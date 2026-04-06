import { IGetRevenueStatsUseCase, RevenueStats } from "@application/IUseCases/admin/IGetRevenueStats";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";

export class GetRevenueStatsUseCase implements IGetRevenueStatsUseCase{
    constructor(
        private _paymentRepository:IPaymentRepository,
        private _enrollmentRepository:IEnrollmentRepository
    ){}

    async execute():Promise<RevenueStats>{
        const totalRevenue = await this._paymentRepository.getTotalRevenue();
        const activeEnrollments = await this._enrollmentRepository.getCount({status:EnrollmentStatus.Active});
        const cancelledEnrollments = await this._enrollmentRepository.getCount({status:EnrollmentStatus.Cancelled});

        return {
            gross: totalRevenue.totalGrossRevenue,
            platform: totalRevenue.companyRevenue,
            instructor: totalRevenue.instructorShare,
            totalEnrollments: activeEnrollments + cancelledEnrollments,
            activeEnrollments: activeEnrollments,
            cancelledEnrollments: cancelledEnrollments
        };

    }
}