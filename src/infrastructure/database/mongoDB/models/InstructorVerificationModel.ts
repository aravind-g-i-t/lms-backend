import mongoose, { Schema, model, Document } from "mongoose";

export interface InstructorVerificationDoc extends Document {
  _id: mongoose.Types.ObjectId;
  instructorId: mongoose.Types.ObjectId;
  status: "Pending" | "Under review" | "Verified" | "Rejected";
  createdAt: Date;
  remarks?: string;
}

const InstructorVerificationSchema = new Schema<InstructorVerificationDoc>(
  {
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Under review", "Verified", "Rejected"],
      default: "Pending",
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const InstructorVerificationModel = model<InstructorVerificationDoc>(
  "InstructorVerification",
  InstructorVerificationSchema
);
