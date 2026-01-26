import { MyReviewForLIsting, ReviewForLearnerListing } from "@application/dtos/review/ReviewForLearnerListing";

export interface IGetReviewsForLearnerUseCase{
    execute(input:{courseId:string; learnerId:string; skip:number; limit:number}):Promise<{myReview:MyReviewForLIsting|null; reviews:ReviewForLearnerListing[]}>
}