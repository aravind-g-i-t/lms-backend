export enum DiscountType {
    Percentage = "percentage",
    Amount = "amount"
}

export interface Coupon{
    id:string;
    description:string;
    code:string;
    discountType:DiscountType
    discountValue:number;
    maxDiscount:number|null;
    minCost:number;
    expiresAt:Date;
    isActive:boolean
    usageLimit:number;
    usageCount:number;
    createdAt:Date;
}