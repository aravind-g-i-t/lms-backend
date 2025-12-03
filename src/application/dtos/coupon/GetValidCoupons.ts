import { Coupon } from "@domain/entities/Coupon";

export interface NotApplicableCoupon {
  couponId: string;
  code: string;
  reason: string;
}

export interface GetValidCouponsOutput {
  applicable: Coupon[];
  notApplicable: NotApplicableCoupon[];
}
