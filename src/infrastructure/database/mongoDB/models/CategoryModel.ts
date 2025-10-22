import mongoose, { Schema, Document, Types } from "mongoose";

export interface CategoryDoc extends Document {
	_id: Types.ObjectId;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const CategorySchema: Schema<CategoryDoc> = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		isActive: { type: Boolean, default: true }
	},
	{ timestamps: true }
);

export const CategoryModel = mongoose.model<CategoryDoc>("Category", CategorySchema);