import mongoose, { Schema, Document } from "mongoose";

export interface AdminDocument extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
}

const AdminSchema = new Schema<AdminDocument>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export const AdminModel = mongoose.model<AdminDocument>("Admin", AdminSchema);
