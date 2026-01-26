import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { logger } from "@infrastructure/logging/Logger";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";
import { IVerifyPaymentUseCase } from "@application/IUseCases/payment/IVerifyPayment";

export class PaymentController {
  constructor(
    private _verifyPaymentUseCase: IVerifyPaymentUseCase
  ) {}

  async verifyPayment(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId } = req.query;

      const result = await this._verifyPaymentUseCase.execute(
        sessionId as string
      );

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Payment status fetched successfully", {
            status: result.status,
          })
        );
    } catch (err) {
      logger.warn("Failed to fetch payment status.");
      next(err);
    }
  }
}
