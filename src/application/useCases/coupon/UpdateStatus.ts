import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateCouponStatusUseCase } from "@application/IUseCases/coupon/IUpdateStatus";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { MESSAGES } from "shared/constants/messages";

export class UpdateCouponStatusUseCase implements IUpdateCouponStatusUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(id: string): Promise<void> {
    const coupon = await this.couponRepository.updateStatus(id);
    if (!coupon) {
      throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}
