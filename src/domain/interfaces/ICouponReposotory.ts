import { Coupon } from "@domain/entities/Coupon";
import { IBaseRepository } from "./IBaseRepository";

export interface ICouponRepository extends IBaseRepository<Coupon> {

    findActive(): Promise<Coupon[]>;

    incrementUsage(id: string): Promise<Coupon | null>;

    findAll(input: { page: number; limit: number; search?: string, filter?: { isActive?: boolean } }): Promise<{
        coupons: Coupon[],
        totalPages: number,
        totalCount: number
    }>

    updateStatus(id: string): Promise<Coupon | null>;

    isApplicable(input: { couponId: string; amount: number }): Promise<{
        applicable: boolean;
        reason?: string;
        coupon?: Coupon;
    }>

    applyCoupon(input: { couponId: string; amount: number }): Promise<{
        finalAmount: number;
        discount: number;
        coupon: Coupon;
    }>
}
