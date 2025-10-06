import mongoose, { Schema, Document } from "mongoose";

export interface LearnerDoc extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    walletBalance: number;
    isActive: boolean;
    createdAt:Date;
    password: string|null;
    profilePic: string|null;
    googleId:string|null;
    bio:string|null;
}

const LearnerSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        walletBalance: { type: Number, required: true },
        isActive: { type: Boolean, required: true },
        password: { type: String ,default:null},
        profilePic: { type: String ,default:null},
        googleId:{ type:String,default:null},
        bio:{type:String,default:null}
    },
    { timestamps: true }
);

export const LearnerModel = mongoose.model<LearnerDoc>("Learner", LearnerSchema);
