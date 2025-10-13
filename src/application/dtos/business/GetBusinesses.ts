import { BusinessForListing } from "./BusinessDTO";

export interface GetBusinessesInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
  verificationStatus?:"Not Submitted"|"Under Review"|"Verified"|"Rejected";
}

export interface GetBusinessesOutput {
  businesses: BusinessForListing[];   
  totalPages: number;
  totalCount: number;
}