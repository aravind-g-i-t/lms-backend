import { InstructorVerificationStatus } from "@domain/types/InstructorVerificationStatus";

export interface InstructorVerification{
    id:string;
    instructorId:string;
    status:"Pending"|"Under review"|"Verified"|"Rejected";
    remarks:string|null;
    appliedOn:Date;
}