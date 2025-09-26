import { Instructor } from "@domain/entities/Instructor";



interface InstructorVerification{
    id: string;
    name: string;
    email: string;
    status: "Pending" | "Verified" | "Rejected";
    appliedOn: Date;
    profilePic: string | null;
}


export interface GetInstructorVerificationsInput {
  page: number;
  limit: number;
  search?: string;
  status?: "Pending"|"Under review"|"Verified"|"Rejected";
}

export interface GetInstructorVefificationsOutput {
  instructorVerifications: InstructorVerification[];   
  totalPages: number;
  totalCount: number;
}

export interface IGetInstructorVerificationsUseCase{
    execute(input:GetInstructorVerificationsInput):Promise<GetInstructorVefificationsOutput>
}