import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { logger } from "@infrastructure/logging/Logger";
import { IInitiateEnrollmentUseCase } from "@application/IUseCases/enrollment/IInitiateEnrollment";
import { IGetEnrollmentsUseCase } from "@application/IUseCases/enrollment/IGetEnrollments";
import { GetEnrollmentsRequestSchema } from "@presentation/dtos/enrollment/GetEnrollments";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";

export class EnrollmentController {
  constructor(
    private _initatiatEnrollmentUseCase: IInitiateEnrollmentUseCase,
    private _getEnrollmentsUseCase: IGetEnrollmentsUseCase
  ) {}

  async initiateEnrollment(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId, method, couponId } = req.body;

      const learnerId = req.user?.id;
      if (!learnerId) {
        throw new AppError(
          "Failed to access user details",
          STATUS_CODES.NOT_FOUND
        );
      }

      const result = await this._initatiatEnrollmentUseCase.execute({
        learnerId,
        courseId,
        paymentMethod: method,
        couponId,
      });

      const message =
        method === "wallet"
          ? "Enrollment created successfully"
          : "Enrollment initiated successfully";

      res
        .status(STATUS_CODES.CREATED)
        .json(
          ResponseBuilder.success(message, {
            sessionId: result.sessionId,
          })
        );
    } catch (err) {
      logger.warn("Failed to create payment session");
      next(err);
    }
  }

  getEnrollments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { query } = GetEnrollmentsRequestSchema.parse(req);

      const learnerId = req.user?.id;
      if (!learnerId) {
        throw new AppError(
          "Failed to access user details",
          STATUS_CODES.NOT_FOUND
        );
      }

      const { page, search, limit } = query;
      const result = await this._getEnrollmentsUseCase.execute({
        page,
        search,
        limit,
        learnerId,
      });

      logger.info("Enrollments fetched for listing successfully.");

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Enrollments fetched successfully", {
            enrollments: result.data,
            totalCount: result.total,
          })
        );
    } catch (error) {
      logger.warn("Failed to fetch enrollments for listing.");
      next(error);
    }
  };
}
