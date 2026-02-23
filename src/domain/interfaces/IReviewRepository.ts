import { Learner } from "@domain/entities/Learner";
import { Review } from "@domain/entities/Review";
import { IBaseRepository } from "./IBaseRepository";

export interface HydratedReview {
    id: string,

    courseId: string,
    learner: Learner,

    rating: number,
    reviewText: string | null,

    isVisible: boolean,
    isEdited: boolean,

    createdAt: Date,
    updatedAt: Date
}


export interface IReviewRepository extends IBaseRepository<Review> {

    findManyWithPagination({ skip, limit, courseId, learnerId }: { skip: number; limit: number; courseId: string; learnerId?: string }): Promise<HydratedReview[]>
    getRatingSum(courseId: string): Promise<number>

}