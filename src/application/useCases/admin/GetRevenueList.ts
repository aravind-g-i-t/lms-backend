import { EnrollmentItem, IGetRevenueListUseCase } from "@application/IUseCases/admin/IGetRevenueList";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";

export class GetRevenueListUseCase implements IGetRevenueListUseCase{
    constructor(
        private _enrollmentRepository: IEnrollmentRepository,
        
    ){}
    async execute(page: number, limit: number): Promise<{ enrollments: EnrollmentItem[]; totalCount: number; totalPages: number }> {
        const enrollmentsData = await this._enrollmentRepository.getRevenueList(page, limit );
        return {
            enrollments: enrollmentsData.enrollments,
            totalCount: enrollmentsData.totalCount,
            totalPages: enrollmentsData.totalPages
        };
    }
}