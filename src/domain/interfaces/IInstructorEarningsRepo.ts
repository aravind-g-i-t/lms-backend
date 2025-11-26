import { EarningStatus, InstructorEarnings } from "@domain/entities/InstructorEarning";


export interface IInstructorEarningsRepository {
  create(data: Partial<InstructorEarnings>): Promise<InstructorEarnings | null>;
  findById(id: string): Promise<InstructorEarnings | null>;
  findByInstructor(instructorId: string): Promise<InstructorEarnings[]>;
  findPending(beforeDate: Date): Promise<InstructorEarnings[]>; // for cron job
  updateStatus(
    id: string,
    status: EarningStatus,
    releaseAt?: Date | null,
    cancelledAt?: Date | null
  ): Promise<InstructorEarnings | null>;
}
