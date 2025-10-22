import { LearnerForListing } from "./LearnerDTO";

export interface GetLearnersInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
  // verificationStatus?:"Not Submitted"|"Under Review"|"Verified"|"Rejected";
}

export interface GetLearnersOutput {
  learners: LearnerForListing[];   
  totalPages: number;
  totalCount: number;
}