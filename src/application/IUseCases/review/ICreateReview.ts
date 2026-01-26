import { Review } from "@domain/entities/Review";

export interface ICreateReviewUseCase{
    execute(input:{learnerId:string; courseId:string; rating:number; reviewText:string|null}):Promise<Review>
}