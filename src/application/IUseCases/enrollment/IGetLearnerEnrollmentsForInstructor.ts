import { EnrollmentStatus } from "@domain/entities/Enrollment";

interface EnrollmentForListing {
  id: string;
  courseTitle: string;
  thumbnail: string|null;
  duration: number;
  paidAmount: number;
  progressPercentage: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  courseId:string;
}

interface LearnerForListing{
    name:string
    id:string;
    email:string;
    profilePic:string|null
}

export interface LearnerEnrollmentsOutputDTO {
  learner: LearnerForListing;
  enrollments: EnrollmentForListing[];
}

export interface IGetLearnerEnrollmentsForInstructorUseCase {
    execute(input:{instructorId: string; page: number; limit: number; search?: string;}):Promise<{learners:LearnerEnrollmentsOutputDTO[],total:number}>
}