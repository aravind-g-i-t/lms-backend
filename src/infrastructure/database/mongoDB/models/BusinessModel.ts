// infrastructure/database/mongo/models/OrganisationModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface BusinessDoc extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  isActive: boolean;
  planId?: string;
  planStartDate?: Date;
  planEndDate?: Date;
  maxEmployees?: number;
  employees: string[];
  password?: string;
  profilePic?: string;
  googleId?:string;
}

const BusinessSchema: Schema<BusinessDoc> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true, default: true },
    employees: {type: [String],required: true,default: [] }, 
    planId: { type: String },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    maxEmployees: { type: Number },
    password: { type: String },
    profilePic: { type: String },
    googleId:{type:String}
  },
  {
    timestamps: true,
  }
);

export const BusinessModel = mongoose.model<BusinessDoc>("Business", BusinessSchema);