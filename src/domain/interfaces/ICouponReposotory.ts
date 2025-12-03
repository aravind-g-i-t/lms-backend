import { Coupon } from "@domain/entities/Coupon";

export interface ICouponRepository {
    create(data: Partial<Coupon>): Promise<Coupon>;

    findById(id: string): Promise<Coupon | null>;

    findByCode(code: string): Promise<Coupon | null>;

    findActive(): Promise<Coupon[]>;

    update(id: string, data: Partial<Coupon>): Promise<Coupon | null>;

    incrementUsage(id: string): Promise<Coupon | null>;

    findAll(input: { page: number; limit: number; search?: string, filter?: { isActive?: boolean } }): Promise<{
        coupons: Coupon[],
        totalPages: number,
        totalCount: number
    }>

    updateStatus(id: string): Promise<Coupon | null>;
}
