import { CategoryForListing } from "./categoryDTO";

export interface GetCategoriesInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";

}

export interface GetCategoriesOutput {
  categories: CategoryForListing[];   
  totalPages: number;
  totalCount: number;
}