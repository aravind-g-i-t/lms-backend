import { CourseForLearnerListing } from "./CourseDTO";

export interface GetCoursesForLearnerOutput{
    courses:CourseForLearnerListing[];
    pagination:{
        totalPages:number,
        totalCount:number
    }
}