// infrastructure/database/mongo/models/OrganisationModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface BusinessDoc extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  isActive: boolean;
  createdAt:Date;
  employees: string[];
  businessDomain?:string;
  website?:string;
  location?:string;
  planId?: string;
  planStartDate?: Date;
  planEndDate?: Date;
  maxEmployees?: number;
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
    businessDomain:{type:String},
    website:{type:String},
    location:{type:String},
    planId: { type: String },
    planStartDate: { type: Date },
    planEndDate: { type: Date },
    maxEmployees: { type: Number },
    profilePic: { type: String },
    password: { type: String },
    googleId:{type:String},
  },
  {
    timestamps: true,
  }
);

export const BusinessModel = mongoose.model<BusinessDoc>("Business", BusinessSchema);