
interface Business{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    planName:string;
    employeeCount:number;
    profilePic?: string;
}

export interface GetBusinessesInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Active" | "Blocked";
}

export interface GetBusinessesOutput {
  businesses: Business[];   
  totalPages: number;
  totalCount: number;
}

export interface IGetBusinessesUseCase{
    execute(input:GetBusinessesInput):Promise<GetBusinessesOutput>
}