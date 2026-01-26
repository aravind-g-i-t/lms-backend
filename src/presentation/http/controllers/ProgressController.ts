import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { logger } from "@infrastructure/logging/Logger";
import { IMarkChapterAsCompletedUseCase } from "@application/IUseCases/learnerProgress/IMarkChapterAsCompleted";
import { IUpdateCurrentChapterUseCase } from "@application/IUseCases/course/IUpdateCurrentChapter";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";

export class ProgressController {
  constructor(
    private _markChapterAsCompletedUseCase: IMarkChapterAsCompletedUseCase,
    private _updateCurrentChapterUseCase: IUpdateCurrentChapterUseCase
  ) {}

  async markChapterAsCompleted(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId, chapterId } = req.body;

      const learnerId = req.user?.id;
      if (!learnerId) {
        throw new AppError(
          "Failed to access user details",
          STATUS_CODES.NOT_FOUND
        );
      }

      await this._markChapterAsCompletedUseCase.execute({
        courseId,
        chapterId,
        learnerId,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Progress updated successfully")
        );
    } catch (err) {
      logger.warn("Failed to update progress.");
      next(err);
    }
  }

  async updateCurrentChapter(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId, chapterId } = req.body;

      const learnerId = req.user?.id;
      if (!learnerId) {
        throw new AppError(
          "Failed to access user details",
          STATUS_CODES.NOT_FOUND
        );
      }

      await this._updateCurrentChapterUseCase.execute({
        courseId,
        chapterId,
        learnerId,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Progress updated successfully")
        );
    } catch (err) {
      logger.warn("Failed to update progress.");
      next(err);
    }
  }
}
