import { Coupon } from "@domain/entities/Coupon";
import { CouponDoc } from "../models/CouponModel";

export class CouponMapper {
  static toDomain(doc: CouponDoc): Coupon {
    return {
      id: doc._id.toString(),
      description: doc.description,
      code: doc.code,

      discountType: doc.discountType,
      discountValue: doc.discountValue,
      maxDiscount: doc.maxDiscount,

      minCost: doc.minCost,
      expiresAt: doc.expiresAt,
      isActive: doc.isActive,

      usageLimit: doc.usageLimit,
      usageCount: doc.usageCount,

      createdAt: doc.createdAt,
    };
  }
}
