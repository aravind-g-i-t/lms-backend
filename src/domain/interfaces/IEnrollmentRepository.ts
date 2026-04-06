import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { Learner } from "@domain/entities/Learner";
import { LearnerProgress } from "@domain/entities/LearnerProgress";
import { Payment } from "@domain/entities/Payment";
import { IBaseRepository } from "./IBaseRepository";

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
    learnerName: string;
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
    courseId: string
}

export interface LearnerForListing {
    name: string
    id: string;
    email: string;
    profilePic: string
}

export interface RevenueListItem {
    id: string;
    learnerName: string;
    courseTitle: string;
    amount: number;
    status: string;
    method: string;
    date: Date;
}

export interface LearnerEnrollmentsOutput {
    learner: LearnerForListing;
    enrollments: EnrollmentForListing[];
}

export interface IEnrollmentRepository extends IBaseRepository<Enrollment> {
    
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
    updateProgress(id: string, progress: number, completedChapters: string[]): Promise<Enrollment | null>;
    getEnrolledCourseIdsByLearnerId(learnerId: string): Promise<string[]>;
    findHydratedEnrollments(input: { filter: Partial<Enrollment>, limit: number; page: number; }): Promise<{
        enrollments: HydratedEnrollment[],
        total: number,
    }>
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

    getCompletedEnrollmentsCount(courseId: string): Promise<number>

    getTopInstructorsByEnrollments(limit: number): Promise<{ instructorId: string; name:string; profilePic: string|null; enrollments: number ,}[]>

    getEnrolledLearners(courseId: string): Promise<string[]>

    getRevenueList(page: number, limit: number): Promise<{ enrollments: RevenueListItem[]; totalCount: number, totalPages: number; }>
}

