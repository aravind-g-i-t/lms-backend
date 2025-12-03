import { Schema, model, Document, Types } from "mongoose";

export interface FavouriteDoc extends Document {
    _id: Types.ObjectId;
    learnerId: Types.ObjectId;
    courseId: Types.ObjectId;
    createdAt: Date;
}

const FavouriteSchema = new Schema<FavouriteDoc>({
    learnerId: { type: Schema.Types.ObjectId, required: true ,ref:"Learner"},
    courseId: { type: Schema.Types.ObjectId, required: true ,ref:"Course"},
},{timestamps:true}
);

export const FavouriteModel = model<FavouriteDoc>("Favourite", FavouriteSchema);
