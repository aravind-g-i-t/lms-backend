import { InstructorForListing } from "./InstructorDTO";

export interface GetInstructorsInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
  verificationStatus?:"Not Submitted"|"Under Review"|"Verified"|"Rejected";
}

export interface GetInstructorsOutput {
  instructors: InstructorForListing[];   
  totalPages: number;
  totalCount: number;
}