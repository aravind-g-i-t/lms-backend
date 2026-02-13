// import { Course } from "@domain/entities/Course";
import { Course } from "@domain/entities/Course";
import { EarningStatus, InstructorEarnings } from "@domain/entities/InstructorEarning";
import { Learner } from "@domain/entities/Learner";
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

export interface IInstructorEarningsRepository {
    create(data: Partial<InstructorEarnings>): Promise<InstructorEarnings | null>;
    findById(id: string): Promise<InstructorEarnings | null>;
    findByInstructor(instructorId: string): Promise<InstructorEarnings[]>;
    findPending(beforeDate: Date): Promise<InstructorEarnings[]>; // for cron job
    //   updateStatus(
    //     id: string,
    //     status: EarningStatus,
    //     releaseAt?: Date | null,
    //     cancelledAt?: Date | null
    //   ): Promise<InstructorEarnings | null>;

    getEarnings(
        params: GetInstructorEarningsInput
    ): Promise<GetInstructorEarningsOutput>

    updateById(id: string, data: Partial<InstructorEarnings>): Promise<InstructorEarnings | null>

    findOneAndUpdate(fiter: Partial<InstructorEarnings>, data: Partial<InstructorEarnings>): Promise<InstructorEarnings | null>
}
