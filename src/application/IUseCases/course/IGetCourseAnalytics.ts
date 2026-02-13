

export interface GetCourseAnalyticsInput {
  courseId: string;
  // timeRange: "7d" | "30d" | "90d" | "all";
}

export interface CourseAnalyticsDTO {

  enrollmentStats: {
    total: number;
    active: number;
    completed: number;
    completionRate: number;
    // trend: {
    //   date: string;
    //   enrollments: number;
    //   revenue: number;
    // }[];
  };

  progressStats: {
    averageProgress: number;
    // moduleAnalytics: {
    //   moduleId: string;
    //   title: string;
    //   completionRate: number;
    //   chapters: {
    //     chapterId: string;
    //     title: string;
    //     completionRate: number;
    //     averageTimeSpent: number;
    //     dropoffRate: number;
    //   }[];
    // }[];
  };

//   quizStats: {
//     totalAttempts: number;
//     passed: number;
//     failed: number;
//     notAttended: number;
//     passRate: number;
//     averageScore: number;
//   } | null;

//   topPerformers: {
//     learnerId: string;
//     learnerName: string;
//     progressPercentage: number;
//   }[];

  recentEnrollments: {
    learnerId: string;
    learnerName: string;
    enrolledAt: Date;
    progressPercentage: number;
  }[];
}

export interface IGetCourseAnalyticsUseCase {
  execute(input: GetCourseAnalyticsInput): Promise<CourseAnalyticsDTO>;
}
