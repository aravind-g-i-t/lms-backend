import mongoose, { Schema, model, Document } from "mongoose";

export interface InstructorDoc extends Document {
    _id: mongoose.Types.ObjectId,
    name: string;
    email: string;
    isActive: boolean;
    walletBalance: number;
    expertise: string[];
    verification: {
        status: "Not Submitted" | "Under Review" | "Verified" | "Rejected",
        remarks: string|null;
    };
    rating?: number;
    designation?: string;
    password?: string;
    profilePic?: string;
    resume?: string;
    googleId?: string;
    website?: string;
    bio?: string;
    createdAt: Date;

}

const InstructorSchema = new Schema<InstructorDoc>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    walletBalance: { type: Number, default: 0 },
    expertise: { type: [String], required: true, default: [] },
    verification: {
        status: {
            type: String,
            enum: ["Not Submitted", "Under Review", "Verified", "Rejected"],
            required: true,
            default: "Not Submitted"
        },
        remarks: {
            type: String,
            default:null
        }
    },
    rating: { type: Number },
    designation: { type: String },
    password: { type: String },
    profilePic: { type: String },
    resume: { type: String },
    googleId: { type: String },
    website: { type: String },
    bio: { type: String },
}, { timestamps: true });

export const InstructorModel = model<InstructorDoc>("Instructor", InstructorSchema);
