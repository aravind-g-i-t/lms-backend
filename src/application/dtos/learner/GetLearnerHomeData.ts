import { CourseForLearnerListing } from "../course/CourseDTO";
import { EnrollmentsForLearnerListing } from "../enrollment/GetEnrollments";

export interface GetLearnerHomeDataOutput{
    enrolledCourses:EnrollmentsForLearnerListing[],
    enrolledCount:number,
    recommendedCourses:CourseForLearnerListing[]
}