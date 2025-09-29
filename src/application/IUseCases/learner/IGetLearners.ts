import { Learner } from "@domain/entities/Learner";


export interface GetLearnersInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
  verificationStatus?:"Not Submitted"|"Under Review"|"Verified"|"Rejected";
}

export interface GetLearnersOutput {
  learners: Learner[];   
  totalPages: number;
  totalCount: number;
}

export interface IGetLearnersUseCase{
    execute(input:GetLearnersInput):Promise<GetLearnersOutput>
}
