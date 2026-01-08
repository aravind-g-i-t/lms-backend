import { Coupon } from "@domain/entities/Coupon";

export interface ICouponRepository {
    create(data: Partial<Coupon>): Promise<Coupon|null>;

    findById(id: string): Promise<Coupon | null>;

    findOne(input:Partial<Coupon>): Promise<Coupon | null>;

    findActive(): Promise<Coupon[]>;

    updateById(id: string, data: Partial<Coupon>): Promise<Coupon | null>;

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
