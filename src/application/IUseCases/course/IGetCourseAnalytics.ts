// application/usecases/course/GetCourseAnalyticsUseCase.ts

import { CourseLevel, CourseStatus } from "@domain/entities/Course";

export interface GetCourseAnalyticsInput {
  courseId: string;
  timeRange: "7d" | "30d" | "90d" | "all";
}

export interface CourseAnalyticsDTO {
  course: {
    id: string;
    title: string;
    level: CourseLevel;
    status: CourseStatus;
    price: number;
    thumbnail: string | null;
    rating: number | null;
    totalRatings: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };

  enrollmentStats: {
    total: number;
    active: number;
    completed: number;
    completionRate: number;
    trend: {
      date: string;
      enrollments: number;
      revenue: number;
    }[];
  };

  progressStats: {
    averageProgress: number;
    moduleAnalytics: {
      moduleId: string;
      title: string;
      completionRate: number;
      chapters: {
        chapterId: string;
        title: string;
        completionRate: number;
        averageTimeSpent: number;
        dropoffRate: number;
      }[];
    }[];
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
