import { Schema, model, Document, Types } from "mongoose";
import { EnrollmentStatus } from "@domain/entities/Enrollment";

export interface EnrollmentDoc extends Document {
    _id: Types.ObjectId
    learnerId: Types.ObjectId;
    courseId: Types.ObjectId;
    enrolledAt: Date|null;
    status: EnrollmentStatus;
    paymentId: Types.ObjectId;
    certificate: string | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
    createdAt:Date;
    instructorId:Types.ObjectId;
    courseTitle:string;
    instructorName:string
    thumbnail:string;
    duration:number;
}

const EnrollmentSchema = new Schema<EnrollmentDoc>(
    {
        learnerId: { type: Schema.Types.ObjectId, ref: "Learner", required: true, index: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
        enrolledAt: { type: Date, default: null },
        status: {
            type: String,
            enum: Object.values(EnrollmentStatus),
            required: true,
            default: EnrollmentStatus.Active,
        },
        paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
        certificate: { type: String, default: null },
        completedAt: { type: Date, default: null },
        cancelledAt: { type: Date, default: null },
        instructorId:{ type: Schema.Types.ObjectId, ref: "Instructor", required: true },
        courseTitle:{type:String,required:true},
        instructorName:{type:String,required:true},
        thumbnail:{type:String,required:true},
        duration:{type:Number,required:true},
    },
    { timestamps: true }
);

EnrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

export const EnrollmentModel = model<EnrollmentDoc>(
    "Enrollment",
    EnrollmentSchema
);
