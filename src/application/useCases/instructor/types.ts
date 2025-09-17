
interface Instructor{
    id: string;
    name: string;
    email: string;
    isActive:boolean;
    isVerified:boolean;
    walletBalance:number;
    profilePic?: string;
}

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
