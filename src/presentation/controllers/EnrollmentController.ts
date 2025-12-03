import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/middlewares/createAuthMiddleware";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { logger } from "@infrastructure/logging/Logger";
import { IInitiateEnrollmentUseCase } from "@application/IUseCases/enrollment/IInitiateEnrollment";
import { IGetEnrollmentsUseCase } from "@application/IUseCases/enrollment/IGetEnrollments";
import { GetEnrollmentsRequestSchema } from "@presentation/dtos/enrollment/GetEnrollments";

export class EnrollmentController {
    constructor(
        private _initatiatEnrollmentUseCase: IInitiateEnrollmentUseCase,
        private _getEnrollmentsUseCase: IGetEnrollmentsUseCase
    ) { }

    async initiateEnrollment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId, method,couponId } = req.body;
            console.log(courseId, method,couponId);

            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError("Failed to access user details", STATUS_CODES.NOT_FOUND)
            }

            const result = await this._initatiatEnrollmentUseCase.execute({ learnerId, courseId, paymentMethod: method ,couponId});

            const message = method === "wallet" ? "Enrollment created successfully." : "Enrollment initialted successfully";

            res.status(201).json({
                success: true,
                message,
                sessionId: result.sessionId
            });
        } catch (err) {
            logger.warn("Failed to create payment session")
            next(err)
        }
    }

    getEnrollments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { query } = GetEnrollmentsRequestSchema.parse(req);

            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError("Failed to access user details", STATUS_CODES.NOT_FOUND)
            }

            const { page, search, limit } = query
            const result = await this._getEnrollmentsUseCase.execute({ page, search, limit, learnerId });

            const response = {
                success: true,
                message: "Enrollments fetched succesfully",
                enrollments: result.data,
                totalCount: result.total,
            }
            logger.info("Enrollments fetched for listing successfully.")
            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            logger.warn("Failed to fetch enrollments for listing.")
            next(error)
        }
    }

}