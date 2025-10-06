
export interface BusinessForListing{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    planName?:string;
    employeeCount:number;
    profilePic?: string;
    verification:{
      status:string,
      remarks:string|null
    }
}

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

export interface IGetBusinessesUseCase{
    execute(input:GetBusinessesInput):Promise<GetBusinessesOutput>
}