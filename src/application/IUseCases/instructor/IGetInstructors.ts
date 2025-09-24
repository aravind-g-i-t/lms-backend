import { Instructor } from "@domain/entities/Instructor";





export interface GetInstructorsInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
}

export interface GetInstructorsOutput {
  instructors: Instructor[];   
  totalPages: number;
  totalCount: number;
}

export interface IGetInstructorsUseCase{
    execute(input:GetInstructorsInput):Promise<GetInstructorsOutput>
}