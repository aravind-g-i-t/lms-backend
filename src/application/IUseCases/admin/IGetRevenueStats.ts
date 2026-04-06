export interface RevenueStats {
    gross: number;
    platform: number;
    instructor: number;
    totalEnrollments: number;
    activeEnrollments: number;
    cancelledEnrollments: number;
}


export interface IGetRevenueStatsUseCase {
    execute(): Promise<RevenueStats>
}