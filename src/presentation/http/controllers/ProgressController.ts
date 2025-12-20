import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { logger } from "@infrastructure/logging/Logger";
import { IMarkChapterAsCompletedUseCase } from "@application/IUseCases/learnerProgress/IMarkChapterAsCompleted";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";

export class ProgressController {
    constructor(
        private _markChapterAsCompletedUseCase: IMarkChapterAsCompletedUseCase
    ) { }

    async markChapterAsCompleted(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId, chapterId } = req.body;

            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError("Failed to access user details", STATUS_CODES.NOT_FOUND)
            }

            await this._markChapterAsCompletedUseCase.execute({
                courseId,
                chapterId,
                learnerId
            })

            res.status(201).json({
                success: true,
                message: "Payment status fetched successfully",
            });
        } catch (err) {
            logger.warn("Failed to fetch payment status.")
            next(err)
        }
    }
}