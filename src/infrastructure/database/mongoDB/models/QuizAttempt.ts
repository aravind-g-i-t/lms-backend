import mongoose, { Schema, Document, Types } from "mongoose";
import { QuizAttemptStatus } from "@domain/entities/QuizAttempt";

export interface QuizAnswerDoc {
    questionId: string;
    selectedOption: number | null;
    isCorrect: boolean | null;
    pointsEarned: number;
}

export interface QuizAttemptDoc extends Document {
    _id:Types.ObjectId;
    quizId: Types.ObjectId;
    learnerId: Types.ObjectId;
    courseId: Types.ObjectId;
    status: QuizAttemptStatus;
    submittedAt: Date | null;
    score: number | null;
    maxScore: number;
    percentage: number | null;
    passed: boolean | null;
    timeTakenSeconds: number | null;
    correctAnswers: number | null;
    totalQuestions: number;
    answers: QuizAnswerDoc[];
    createdAt: Date;
}

const AnswerSchema = new Schema<QuizAnswerDoc>(
    {
        questionId: { type: String, required: true },
        selectedOption: Number,
        isCorrect: Boolean,
        pointsEarned: Number
    },
    { _id: false }
);

const QuizAttemptSchema = new Schema<QuizAttemptDoc>(
    {
        quizId: { type: Schema.Types.ObjectId, required: true },
        learnerId: { type: Schema.Types.ObjectId, required: true },
        courseId: { type: Schema.Types.ObjectId, required: true },
        status: { type: String, enum: Object.values(QuizAttemptStatus), required: true },
        submittedAt: Date,
        score: Number,
        maxScore: Number,
        percentage: Number,
        passed: Boolean,
        timeTakenSeconds: Number,
        correctAnswers: Number,
        totalQuestions: Number,
        answers: [AnswerSchema]
    },
    { timestamps: true }
);

export const QuizAttemptModel= mongoose.model<QuizAttemptDoc>("QuizAttempt", QuizAttemptSchema);
