import { Schema, Types, model } from "mongoose";
import { DiscountType } from "@domain/entities/Coupon";

export interface CouponDoc extends Document {
    _id: Types.ObjectId;
    description: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount: number|null;
    minCost: number;
    expiresAt: Date;
    isActive: boolean;
    usageLimit: number;
    usageCount: number;
    createdAt: Date;

}

const CouponSchema = new Schema<CouponDoc>(
    {
        description: { type: String, required: true },
        code: { type: String, required: true, unique: true },

        discountType: {
            type: String,
            enum: Object.values(DiscountType),
            required: true
        },

        discountValue: { type: Number, required: true },
        maxDiscount: { type: Number ,default:null},
        minCost: { type: Number, required: true },

        expiresAt: { type: Date, required: true },
        isActive: { type: Boolean, default: true },

        usageLimit: { type: Number,required:true },
        usageCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);


export const CouponModel = model("Coupon", CouponSchema);
