import { CourseForAdminListing } from "./CourseDTO";

export interface GetCoursesForAdminInput{ 
    verificationStatus?: "not_verified"|"under_review"|"verified"|"rejected"|"blocked"; 
    page: number; 
    limit: number; 
    search?: string; 
    status?:"published"| "draft"|"archived";
}

export interface GetCoursesForAdminOutput{
    courses:CourseForAdminListing[];
    pagination:{
        totalPages:number,
        totalCount:number
    }
}