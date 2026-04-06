export interface EnrollmentItem {
    id: string;
    learnerName: string;
    courseTitle: string;
    amount: number;
    status: string;
    method: string;
    date: Date;
}

export interface IGetRevenueListUseCase {
    execute(page: number, limit: number): Promise<{
        enrollments: EnrollmentItem[];
        totalCount: number;
        totalPages: number;
    }>;
}