import { HydratedReview } from "@domain/interfaces/IReviewRepository";
import { HydratedReviewDoc, ReviewDoc } from "../models/ReviewModel";
import { Review } from "@domain/entities/Review";
import { LearnerMapper } from "./LearnerMapper";

export class ReviewMapper{
    static toDomain(doc:ReviewDoc):Review{
        return {
            id:doc._id.toString(),
            courseId:doc.courseId.toString(),
            learnerId:doc.learnerId.toString(),
            reviewText:doc.reviewText,
            rating:doc.rating,
            isVisible:doc.isVisible,
            isEdited:doc.isEdited,
            createdAt:doc.createdAt,
            updatedAt:doc.updatedAt,
        }
    }

    static toHydratedDomain(doc:HydratedReviewDoc):HydratedReview{
        return {
            id:doc._id.toString(),
            courseId:doc.courseId.toString(),
            learner:LearnerMapper.toDomain(doc.learnerId),
            reviewText:doc.reviewText,
            rating:doc.rating,
            isVisible:doc.isVisible,
            isEdited:doc.isEdited,
            createdAt:doc.createdAt,
            updatedAt:doc.updatedAt,
        }
    }
}