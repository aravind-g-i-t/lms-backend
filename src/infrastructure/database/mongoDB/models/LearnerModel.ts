import mongoose, { Schema, Document } from "mongoose";

export interface LearnerDoc extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    walletBalance: number;
    isActive: boolean;
    password?: string;
    profilePic?: string;
    googleId?:string;
    bio?:string;
    createdAt:Date;
}

const LearnerSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        walletBalance: { type: Number, required: true },
        isActive: { type: Boolean, required: true },
        password: { type: String },
        profilePic: { type: String },
        googleId:{ type:String},
        bio:{type:String}
    },
    { timestamps: true }
);

export const LearnerModel = mongoose.model<LearnerDoc>("Learner", LearnerSchema);
