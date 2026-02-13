import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { logger } from "@infrastructure/logging/Logger";
import { IInitiateEnrollmentUseCase } from "@application/IUseCases/enrollment/IInitiateEnrollment";
import { IGetEnrollmentsUseCase } from "@application/IUseCases/enrollment/IGetEnrollments";
import { GetEnrollmentsRequestSchema } from "@presentation/dtos/enrollment/GetEnrollments";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";
import { IGetLearnerEnrollmentsForInstructorUseCase } from "@application/IUseCases/enrollment/IGetLearnerEnrollmentsForInstructor";
import { MESSAGES } from "shared/constants/messages";
import { ICancelEnrollmentUseCase } from "@application/IUseCases/enrollment/ICancelEnrollment";

export class EnrollmentController {
    constructor(
        private _initatiatEnrollmentUseCase: IInitiateEnrollmentUseCase,
        private _getEnrollmentsUseCase: IGetEnrollmentsUseCase,
        private _getLearnerEnrollmentsForInstructorUseCase:IGetLearnerEnrollmentsForInstructorUseCase,
        private _cancelEnrollmentUseCase:ICancelEnrollmentUseCase
    ) { }

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
                    MESSAGES.LEARNER_NOT_FOUND,
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
                    MESSAGES.LEARNER_NOT_FOUND,
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

    getLearnerEnrollmentsForInstructor = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { query } = GetEnrollmentsRequestSchema.parse(req);
            const instructorId = req.user?.id;
            console.log(instructorId);
            
            if (!instructorId) {
                throw new AppError(
                    MESSAGES.INSTRUCTOR_NOT_FOUND,
                    STATUS_CODES.NOT_FOUND
                );
            }

            const { page, search, limit } = query;
            const result = await this._getLearnerEnrollmentsForInstructorUseCase.execute({
                page,
                search,
                limit,
                instructorId,
            });

            logger.info("Enrollments fetched for listing successfully.");

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Enrollments fetched successfully", result
                    )
                );
        } catch (error) {
            logger.warn("Failed to fetch enrollments for listing.");
            next(error);
        }
    };

    async cancelEnrollment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { courseId } = req.body;

            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.LEARNER_NOT_FOUND,
                    STATUS_CODES.NOT_FOUND
                );
            }

            await this._cancelEnrollmentUseCase.execute({
                learnerId,
                courseId,
            });

            

            res
                .status(STATUS_CODES.CREATED)
                .json(
                    ResponseBuilder.success(MESSAGES.SUCCESS)
                );
        } catch (err) {
            logger.warn("Failed to create payment session");
            next(err);
        }
    }

}
