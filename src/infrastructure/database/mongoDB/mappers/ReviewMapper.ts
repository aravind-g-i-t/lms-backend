import { HydratedReview } from "@domain/interfaces/IReviewRepository";
import { HydratedReviewDoc, ReviewDoc } from "../models/ReviewModel";
import { Review } from "@domain/entities/Review";
import { LearnerMapper } from "./LearnerMapper";
import { Types } from "mongoose";

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

    static toPersistence(entity: Partial<Review>): Partial<ReviewDoc> {

        const data: Partial<ReviewDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.reviewText !== undefined)
            data.reviewText = entity.reviewText;
        if (entity.rating !== undefined)
            data.rating = entity.rating;
        if (entity.isVisible !== undefined)
            data.isVisible = entity.isVisible;
        if (entity.isEdited !== undefined)
            data.isEdited = entity.isEdited;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.updatedAt !== undefined)
            data.updatedAt = entity.updatedAt;

        return data;
    }
}