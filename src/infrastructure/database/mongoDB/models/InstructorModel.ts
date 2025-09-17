import mongoose,{ Schema, model, Document } from "mongoose";

export interface InstructorDoc extends Document {
    _id:mongoose.Types.ObjectId,
    name: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
    walletBalance: number;
    password?: string;
    profilePic?: string;
    resume?: string;
    googleId?:string;
    website?:string;
    bio?:string;
    createdAt:Date

}

const InstructorSchema = new Schema<InstructorDoc>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    password: { type: String },
    profilePic: { type: String },
    resume: { type: String },
    googleId:{type:String},
    website:{type:String},
    bio:{type:String},
}, { timestamps: true });

export const InstructorModel = model<InstructorDoc>("Instructor", InstructorSchema);
