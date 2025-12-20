import mongoose, { Schema, Document, Types } from "mongoose";

export interface QuestionDoc {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
    explanation: string|null;
    order: number;
}

export interface QuizDoc extends Document {
    _id:Types.ObjectId
    courseId: Types.ObjectId;
    passingScore: number|null;
    timeLimitMinutes: number | null;
    questions: QuestionDoc[];
    totalPoints: number;
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<QuestionDoc>(
    {
        id: { type: String, required: true },
        question: { type: String, required: true },
        options:[ { type: String, required: true }],
        correctAnswer: { type: Number, required: true },
        points: { type: Number, required: true },
        explanation: { type: String, default: null },
        order: { type: Number, required: true }
    },
    { _id: false }
);

const QuizSchema = new Schema<QuizDoc>(
    {
        courseId: { type: Schema.Types.ObjectId, required: true },
        passingScore: { type: Number, default: null },
        timeLimitMinutes: { type: Number, default: null },
        questions: [QuestionSchema],
        totalPoints: Number,
        totalQuestions: Number
    },
    { timestamps: true }
);

export const QuizModel= mongoose.model<QuizDoc>("Quiz", QuizSchema);
