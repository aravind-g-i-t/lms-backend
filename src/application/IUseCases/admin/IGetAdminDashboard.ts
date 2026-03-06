
interface Stats {
    totalCourses: number,
    activeLearners: number,
    activeInstructors: number,
    totalRevenue: {
        totalGrossRevenue: number;
        instructorShare: number;
        companyRevenue: number;
    };
    newLearnersThisMonth: number;
    newInstructorsThisMonth: number;
    totalEnrollments: number
}



interface Course {
    id: string
    title: string;
    enrollmentCount: number;
    rating: number | null;
}

interface Instructor {
    instructorId: string;
    name: string;
    profilePic: string | null;
    enrollments: number;
}



export interface MonthlyRevenue {
    year: number;
    month: number;
    totalGrossAmount: number;
    instructorShare: number;
    companyRevenue: number;
}

export interface IGetAdminDashboardOutputDTO {
    stats: Stats,
    topCourses: Course[];
    topInstructors: Instructor[];
    monthlyRevenue: MonthlyRevenue[],

}


export interface IGetAdminDashboardUseCase {
    execute(): Promise<IGetAdminDashboardOutputDTO>
}