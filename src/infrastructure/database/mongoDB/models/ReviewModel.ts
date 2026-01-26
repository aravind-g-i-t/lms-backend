import { Schema, Types, model } from "mongoose";
import { LearnerDoc } from "./LearnerModel";

export interface ReviewDoc extends Document {
    _id: Types.ObjectId;
    courseId: Types.ObjectId,
    learnerId: Types.ObjectId,

    rating: number,
    reviewText: string | null,

    isVisible: boolean,
    isEdited: boolean,

    createdAt: Date,
    updatedAt: Date

}

export interface HydratedReviewDoc{
    _id: Types.ObjectId,

    courseId: Types.ObjectId,
    learnerId: LearnerDoc,

    rating: number,
    reviewText: string | null,

    isVisible: boolean,
    isEdited: boolean,

    createdAt: Date,
    updatedAt: Date
} 



const ReviewSchema = new Schema<ReviewDoc>(
    {
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },

        learnerId: { type: Schema.Types.ObjectId, ref: "Learner", required: true },

        rating: { type: Number, required: true },
        reviewText: { type: String, default: null },

        isEdited: { type: Boolean, default: false },
        isVisible: { type: Boolean, default: true },
    },
    { timestamps: true }
);


export const ReviewModel = model("Review", ReviewSchema);
