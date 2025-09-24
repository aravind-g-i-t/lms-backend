import { InstructorVerification } from "@domain/entities/InstructorVerification";

export interface FindAllParams{
    page: number; 
    limit: number 
    search?: string; 
    status?: string; 
}


export interface FindAllInstructorVerification{
    instructors:InstructorVerification[],
    totalPages:number,
    totalCount:number,
}