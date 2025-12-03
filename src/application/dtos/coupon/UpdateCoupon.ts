export interface UpdateCouponInputDTO {
    id:string
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