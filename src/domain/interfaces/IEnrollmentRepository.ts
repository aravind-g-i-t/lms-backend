import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { Learner } from "@domain/entities/Learner";
import { LearnerProgress } from "@domain/entities/LearnerProgress";
import { Payment } from "@domain/entities/Payment";
import { FilterQuery } from "mongoose";

export interface HydratedEnrollment {
  id: string;
  learnerId: Learner;
  courseId: string;
  progressId: LearnerProgress | null;
  enrolledAt: Date | null;
  status: EnrollmentStatus;
  paymentId: Payment;
  certificate: string | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  instructorId: string;
  courseTitle: string;
  instructorName: string;
  learnerName:string;
  thumbnail: string;
  duration: number;
}

export interface EnrollmentForListing {
  id: string;
  courseTitle: string;
  thumbnail: string;
  duration: number;
  paidAmount: number;
  progressPercentage: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  courseId:string
}

export interface LearnerForListing{
    name:string
    id:string;
    email:string;
    profilePic:string
}

export interface LearnerEnrollmentsOutput {
  learner: LearnerForListing;
  enrollments: EnrollmentForListing[];
}

export interface IEnrollmentRepository {
  create(data: Partial<Enrollment>): Promise<Enrollment | null>;
  findById(id: string): Promise<Enrollment | null>;
  findOne(filter: Partial<Enrollment>): Promise<Enrollment | null>;
  findMany(filter: Partial<Enrollment>): Promise<Enrollment[]>;
  findPaginatedEnrollments(input:
    {
      learnerId: string,
      search: string | null,
      page: number,
      limit: number,
      filter?: {
        instructorIds?: string[];
        status?: EnrollmentStatus[]
      }
    }
  ): Promise<{ data: Enrollment[]; total: number }>
  updateById(id: string, updates: Partial<Enrollment>): Promise<Enrollment | null>;
  deleteById(id: string): Promise<boolean>;
  updateProgress(id: string, progress: number, completedChapters: string[]): Promise<Enrollment | null>;
  getEnrolledCourseIdsByLearnerId(learnerId: string): Promise<string[]>;
  findHydratedEnrollments(input: { filter: Partial<Enrollment>, limit: number; page: number; }): Promise<{
    enrollments: HydratedEnrollment[],
    total: number,
  }>
  getCount(filter: FilterQuery<Enrollment>): Promise<number>
  getEnrollmentTrend(
    courseId: string,
    from: Date
  ): Promise<
    {
      date: string;
      enrollments: number;
      revenue: number;
    }[]
  >;

  findLearnerEnrollmentsForInstructor(input: { instructorId: string; page: number; limit: number; search?: string; }): Promise<{
  data: LearnerEnrollmentsOutput[];
  total: number;
}>


}

