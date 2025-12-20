import mongoose, { Schema, Document, Types } from "mongoose";

export interface CertificateDoc extends Document {
    _id:Types.ObjectId;
    learnerId: Types.ObjectId;
    courseId: Types.ObjectId;
    enrollmentId: Types.ObjectId;
    quizAttemptId: Types.ObjectId;
    certificateNumber: string;
    issuedAt: Date;
    certificateUrl: string;
    grade:number|null;
    courseTitle: string;
    learnerName: string;
    instructorName: string;
}

const CertificateSchema = new Schema<CertificateDoc>(
    {
        learnerId: { type: Schema.Types.ObjectId, required: true },
        courseId: { type: Schema.Types.ObjectId, required: true },
        enrollmentId: { type: Schema.Types.ObjectId, required: true },
        quizAttemptId: { type: Schema.Types.ObjectId, required: true },
        certificateNumber: { type: String, required: true, unique: true },
        issuedAt: { type: Date, required: true },
        certificateUrl: { type: String, required: true },
        grade:{type:Number,default:null},
        courseTitle: { type: String, required: true },
        learnerName: { type: String, required: true },
        instructorName: { type: String, required: true },
    },
    { timestamps: true }
);

export const CertificateModel= mongoose.model<CertificateDoc>("Certificate", CertificateSchema);
