import { Review } from "@domain/entities/Review";

export interface IUpdateReviewUseCase{
    execute(input: {
        learnerId: string;
        courseId: string;
        rating: 1 | 2 | 3 | 4 | 5;
        reviewText: string | null;
      }): Promise<Review>
}