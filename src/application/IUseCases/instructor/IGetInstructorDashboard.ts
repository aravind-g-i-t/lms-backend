interface DashboardStats {
  totalCourses: number;
  totalEnrollments: number;
  totalEarnings: number;
  pendingEarnings: number;
  averageRating: number;
  totalRatings: number;
  upcomingLiveSessions: number;
}


interface Course {
  id: string;
  title: string;
  enrollmentCount: number;
  rating: number|null;
  thumbnail: string;
}

interface Session {
  id: string;
  courseTitle: string;
  scheduledAt: Date;
  durationInMinutes: number;
  status: string;
}

export interface GetInstructorDashboardOutputDTO{
    stats:DashboardStats;
    upcomingSessions:Session[];
    topCourses:Course[];
}

export interface IGetInstructorDashboardUseCase {
    execute(instructorId:string):Promise<GetInstructorDashboardOutputDTO>
}