import { Coupon } from "@domain/entities/Coupon";

export interface GetAllCouponsInput {
  page: number;
  limit: number;
  search?: string;
  isActive?:boolean
}

export interface GetAllCouponsOutput {
  coupons: Coupon[];   
  totalPages: number;
  totalCount: number;
}