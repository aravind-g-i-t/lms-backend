
interface Stats{
    totalCourses: number,
    activeLearners: number,
    activeInstructors: number,
}

interface Enrollment{
    id: string;
    learner: {
        name:string;
        id:string
    };
    course: {
        title:string;
        id:string;
    };
    amount: number;
    enrolledAt: Date|null
}

interface Course { 
    id:string
    title: string;
    enrollmentCount: number;
    rating: number|null;
}



interface MonthlyRevenue {
  year: number;
  month: number; 
  totalGrossAmount: number;
  instructorShare: number;
  companyRevenue: number;
}

export interface IGetAdminDashboardOutputDTO{
    stats:Stats,
    recentEnrollments:Enrollment[];
    topCourses:Course[];
    revenueData:MonthlyRevenue[]
}


export interface IGetAdminDashboardUseCase{
    execute():Promise<IGetAdminDashboardOutputDTO>
}