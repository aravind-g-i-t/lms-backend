import { QuizStatus } from "@domain/entities/LearnerProgress";
import { Schema, model, Document, Types } from "mongoose";

export interface LearnerProgressDoc extends Document {
    _id:Types.ObjectId;
    learnerId: Types.ObjectId;
    courseId: Types.ObjectId;

    completedChapters: string[];
    progressPercentage: number;

    totalChapters: number;
    currentChapterId: string | null;

    quizAttemptStatus:QuizStatus,
    quizAttemptId:string |null
    
    lastAccessedAt: Date | null;
    createdAt:Date;
    updatedAt:Date;
}

const learnerProgressSchema = new Schema<LearnerProgressDoc>(
    {
        learnerId: { type: Schema.Types.ObjectId, ref: "Learner", required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },

        completedChapters: [{ type: String }],
        progressPercentage: { type: Number, default: 0 },

        totalChapters: { type: Number, required: true },
        currentChapterId: { type: String, default: null },

        quizAttemptStatus:{type:String,enum:Object.values(QuizStatus),default:QuizStatus.NOtAttended},
        quizAttemptId:{ type: String, default: null },

        lastAccessedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

export const LearnerProgressModel = model<LearnerProgressDoc>(
    "LearnerProgress",
    learnerProgressSchema
);
