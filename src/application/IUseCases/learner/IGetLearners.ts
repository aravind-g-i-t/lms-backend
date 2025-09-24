import { Learner } from "@domain/entities/Learner";





export interface GetLearnersInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
}

export interface GetLearnersOutput {
  learners: Learner[];   
  totalPages: number;
  totalCount: number;
}

export interface IGetLearnersUseCase{
    execute(input:GetLearnersInput):Promise<GetLearnersOutput>
}