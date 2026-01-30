import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { Learner } from "@domain/entities/Learner";
import { Payment } from "@domain/entities/Payment";
import { FilterQuery } from "mongoose";

export interface HydratedEnrollment {
    id: string;
    learnerId: Learner;
    courseId: string;
    enrolledAt: Date|null;
    status: EnrollmentStatus;
    paymentId: Payment;
    certificate: string | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
    createdAt:Date;
    instructorId:string;
    courseTitle:string;
    instructorName:string
    thumbnail:string;
    duration:number;
}

export interface IEnrollmentRepository {
  create(data: Partial<Enrollment>): Promise<Enrollment | null>;
  findOne(filter: Partial<Enrollment>): Promise<Enrollment | null>;
  findMany(filter: Partial<Enrollment>): Promise<Enrollment[]>;
  findPaginatedEnrollments(input:
    {learnerId: string,
    search: string | null,
    page: number,
    limit: number,
    filter?: {
            instructorIds?: string[];
            status?: EnrollmentStatus[]
    }}
  ): Promise<{ data: Enrollment[]; total: number }>
  updateById(id: string, updates: Partial<Enrollment>): Promise<Enrollment | null>;
  deleteById(id: string): Promise<boolean>;
  updateProgress(id: string, progress: number, completedChapters: string[]): Promise<Enrollment | null>;
  getEnrolledCourseIdsByLearnerId(learnerId: string): Promise<string[]>;
  findHydratedEnrollments(input:{filter:Partial<Enrollment>,limit:number}): Promise<{
        enrollments:HydratedEnrollment[],
        total:number
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

}

