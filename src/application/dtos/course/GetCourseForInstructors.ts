import { CourseForInstructorListing } from "./CourseDTO";

export interface GetCoursesForInstructorsInput{ 
    instructorId: string; 
    page: number; 
    limit: number; 
    search?: string; 
    status?:"published"| "draft"|"archived";
}

export interface GetCoursesForInstructorsOutput{
    courses:CourseForInstructorListing[];
    pagination:{
        totalPages:number,
        totalCount:number
    }
}