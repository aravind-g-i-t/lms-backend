import {  EarningStatus } from "@domain/entities/InstructorEarning";
import { InstructorWallet } from "@domain/entities/InstructorWallet";

interface InstructorEarnings {
  id: string;
  instructorId: string;
  courseId: string;
  courseTitle: string;
  enrollmentId: string;
  learnerName: string;
  amount: number;
  createdAt: Date;
  releasedAt: Date;
  cancelledAt: Date | null;
  status: EarningStatus;
}

export interface GetInstructorEarningsInputDTO {
    instructorId: string;
    page: number;
    limit: number;
    search?: string;
    status?: string;
}



export interface GetInstructorEarningsOutputDTO {
    earnings: InstructorEarnings[];
    wallet:InstructorWallet,
    pagination:{
        totalItems: number,
        totalPages: number,
        currentPage: number,
        limit: number,
    }
}

export interface IGetInstructorEarningsUseCase{
    execute(input: GetInstructorEarningsInputDTO):Promise<GetInstructorEarningsOutputDTO>
}