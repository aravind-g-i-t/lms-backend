import { GetValidCouponsOutput } from "@application/dtos/coupon/GetValidCoupons";
import { Coupon } from "@domain/entities/Coupon";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";

export class GetValidCouponsUseCase {
    constructor(
        private couponRepo: ICouponRepository
    ) { }

    async execute(input: { amount: number }): Promise<GetValidCouponsOutput> {
        const { amount } = input;

        const coupons = await this.couponRepo.findActive();

        const applicable = [];
        const notApplicable = [];

        for (const coupon of coupons) {
            const reason = this.getReasonIfNotApplicable(coupon, amount);

            if (!reason) {
                applicable.push(coupon);
            } else {
                notApplicable.push({
                    couponId: coupon.id,
                    code: coupon.code,
                    reason,
                });
            }
        }

        return { applicable, notApplicable };
    }

    private  getReasonIfNotApplicable(coupon: Coupon, amount: number): string | null {

        const now = new Date();
        if (new Date(coupon.expiresAt) < now) {
            return "Coupon expired.";
        }

        if (amount < coupon.minCost) {
            return `Minimum purchase ₹${coupon.minCost} required.`;
        }

        return null;
    }
}
