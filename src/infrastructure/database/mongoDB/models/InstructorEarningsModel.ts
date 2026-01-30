import { Schema, model, Document, Types } from "mongoose";
import { LearnerDoc } from "./LearnerModel";
import { CourseDoc } from "./CourseModel";

enum EarningStatus {
    Pending = "pending",
    Released = "released",
    Cancelled = "cancelled"
}

export interface InstructorEarningsDoc extends Document {
    _id: Types.ObjectId;
    instructorId: Types.ObjectId;
    courseId: Types.ObjectId;
    enrollmentId: Types.ObjectId;
    learnerId:Types.ObjectId;
    amount: number;
    createdAt: Date;
    releaseAt: Date;
    cancelledAt: Date | null;
    status: EarningStatus;
}

export interface HydratedInstructorEarningsDoc {
    _id: Types.ObjectId;
    instructorId: Types.ObjectId;
    courseId: CourseDoc;
    enrollmentId: Types.ObjectId;
    learnerId:LearnerDoc;
    amount: number;
    createdAt: Date;
    releaseAt: Date;
    cancelledAt: Date | null;
    status: EarningStatus;
}

const InstructorEarningsSchema = new Schema<InstructorEarningsDoc>(
    {
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: "Instructor",
            required: true,
            index: true
        },

        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true
        },

        enrollmentId: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
            index: true
        },
        learnerId: {
            type: Schema.Types.ObjectId,
            ref: "Learner",
            required: true,
            index: true
        },

        amount: {
            type: Number,
            required: true
        },

        releaseAt: {
            type: Date,
            required: true
        },

        cancelledAt: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["pending", "released", "cancelled"],
            required: true,
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);



export const InstructorEarningsModel = model<InstructorEarningsDoc>(
    "InstructorEarnings",
    InstructorEarningsSchema
);
