// infrastructure/database/mongo/models/OrganisationModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface BusinessDoc extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  employees: string[];
  verification: {
    status: "Not Submitted" | "Under Review" | "Verified" | "Rejected",
    remarks: string | null;
  };
  businessDomain?: string;
  website?: string;
  location?: string;
  planId?: string;
  planStartDate?: Date;
  planEndDate?: Date;
  maxEmployees?: number;
  password?: string;
  profilePic?: string;
  googleId?: string;
}

const BusinessSchema: Schema<BusinessDoc> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true, default: true },
    employees: { type: [String], required: true, default: [] },
    verification: {
      status: {
        type: String,
        enum: ["Not Submitted", "Under Review", "Verified", "Rejected"],
        required: true,
        default: "Not Submitted"
      },
      remarks: {
        type: String,
        default: null
      }
    },
    businessDomain: { type: String },
    website: { type: String },
    location: { type: String },
    planId: { type: String },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    maxEmployees: { type: Number },
    profilePic: { type: String },
    password: { type: String },
    googleId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const BusinessModel = mongoose.model<BusinessDoc>("Business", BusinessSchema);