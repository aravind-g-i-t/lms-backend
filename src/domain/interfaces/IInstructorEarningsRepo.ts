// import { Course } from "@domain/entities/Course";
import { Course } from "@domain/entities/Course";
import { EarningStatus, InstructorEarnings } from "@domain/entities/InstructorEarning";
import { Learner } from "@domain/entities/Learner";
import { IBaseRepository } from "./IBaseRepository";
export interface GetInstructorEarningsInput {
    instructorId: string;
    page: number;
    limit: number;
    search?: string;
    status?: EarningStatus;
}

export interface GetInstructorEarningsOutput {
    earnings: HydratedInstructorEarnings[];
    total: number;
}

export interface HydratedInstructorEarnings {
    id: string;
    instructorId: string;
    courseId: Course;
    enrollmentId: string;
    learnerId: Learner;
    amount: number;
    createdAt: Date;
    releaseAt: Date;
    cancelledAt: Date | null;
    status: EarningStatus;
}

export interface IInstructorEarningsRepository extends IBaseRepository<InstructorEarnings> {
    
    findByInstructor(instructorId: string): Promise<InstructorEarnings[]>;
    findPending(beforeDate: Date): Promise<InstructorEarnings[]>; 

    getEarnings(
        params: GetInstructorEarningsInput
    ): Promise<GetInstructorEarningsOutput>

}
