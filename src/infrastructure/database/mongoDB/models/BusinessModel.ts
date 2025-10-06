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
  businessDomain: string|null;
  website: string|null;
  location: string|null;
  license:string|null;
  planId: string|null;
  planStartDate: Date|null;
  planEndDate: Date|null;
  maxEmployees: number|null;
  password: string|null;
  profilePic: string|null;
  googleId: string|null;
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
      remarks: {type: String, default: null}
    },
    businessDomain: { type: String, default: null },
    website: { type: String , default: null},
    location: { type: String, default: null },
    planId: { type: String, default: null },
    planStartDate: { type: Date, default: null },
    planEndDate: { type: Date, default: null },
    maxEmployees: { type: Number, default: null },
    profilePic: { type: String, default: null },
    password: { type: String, default: null },
    googleId: { type: String, default: null },
    license: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const BusinessModel = mongoose.model<BusinessDoc>("Business", BusinessSchema);