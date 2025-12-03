import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateCouponStatusUseCase } from "@application/IUseCases/coupon/IUpdateStatus";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";

export class UpdateCouponStatusUseCase implements IUpdateCouponStatusUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(id: string): Promise<void> {
    const coupon = await this.couponRepository.updateStatus(id);
    if (!coupon) {
      throw new AppError("Failed to update coupon status",STATUS_CODES.NOT_MODIFIED);
    }
  }
}
