import { Learner } from "@domain/entities/Learner";
import { Review } from "@domain/entities/Review";

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


export interface IReviewRepository {
    create(input: Partial<Review>): Promise<Review | null>
    findById(id: string): Promise<Review | null>;
    updateById(id: string, data: Partial<Review>): Promise<Review | null>
    findOne(filter: Partial<Review>): Promise<Review | null>

    findManyWithPagination({ skip, limit, courseId, learnerId }: { skip: number; limit: number; courseId: string; learnerId?: string }): Promise<HydratedReview[]>
    getRatingSum(courseId: string): Promise<number>

}