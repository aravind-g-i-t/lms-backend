export interface CreateCouponInputDTO {
    description: string;
    code: string;
    discountType: string;
    discountValue: number;
    maxDiscount: number|null;
    minCost: number;
    expiresAt: Date;
    isActive: boolean;
    usageLimit: number;
}