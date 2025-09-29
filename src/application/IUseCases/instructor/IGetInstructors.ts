import { Instructor } from "@domain/entities/Instructor";





export interface GetInstructorsInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
  verificationStatus?:"Not Submitted"|"Under Review"|"Verified"|"Rejected";
}

export interface GetInstructorsOutput {
  instructors: Instructor[];   
  totalPages: number;
  totalCount: number;
}

export interface IGetInstructorsUseCase{
    execute(input:GetInstructorsInput):Promise<GetInstructorsOutput>
}