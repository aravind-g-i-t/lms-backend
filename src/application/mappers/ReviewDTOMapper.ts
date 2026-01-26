import { ReviewForLearnerListing } from "@application/dtos/review/ReviewForLearnerListing";
import { HydratedReview } from "@domain/interfaces/IReviewRepository";

export class ReviewDTOMapper {
    static toListing(input: HydratedReview): ReviewForLearnerListing {
        return {
            id: input.id,
            learner: {
                id:input.learner.id,
                name:input.learner.name,
                profilePic:input.learner.profilePic
            },
            rating: input.rating,
            createdAt: input.createdAt,
            isEdited: input.isEdited,
            reviewText: input.reviewText,
        }
    }
}