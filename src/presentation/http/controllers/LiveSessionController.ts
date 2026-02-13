import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { logger } from "@infrastructure/logging/Logger";

import { IScheduleLiveSessionUseCase } from "@application/IUseCases/liveSession/IScheduleLiveSession";
import { IGetSessionListForInstructorUseCase } from "@application/IUseCases/liveSession/IGetSessionListForInstructor";
import { IStartLiveSessionUseCase } from "@application/IUseCases/liveSession/IStartLiveSession";
import { IJoinLiveSessionUseCase } from "@application/IUseCases/liveSession/IJoinLiveSession";
import { IGetSessionListForLearnerUseCase } from "@application/IUseCases/liveSession/IGetSessionListForLearner";
import { IEndLiveSessionUseCase } from "@application/IUseCases/liveSession/IEndLiveSession";

import { GetSessionListForInstructorRequestSchema } from "@presentation/dtos/liveSession/GetSessionListForInstructor";
import { GetSessionListForLearnerRequestSchema } from "@presentation/dtos/liveSession/GetSessionListForLearner";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";
import { ICancelLiveSessionUseCase } from "@application/IUseCases/liveSession/ICancelLiveSession";

export class LiveSessionController {
    constructor(
        private _scheduleLiveSessionUseCase: IScheduleLiveSessionUseCase,
        private _getSessionListForInstructorUseCase: IGetSessionListForInstructorUseCase,
        private _startLiveSessionUseCase: IStartLiveSessionUseCase,
        private _joinLiveSessionUseCase: IJoinLiveSessionUseCase,
        private _getSessionListForLearnerUseCase: IGetSessionListForLearnerUseCase,
        private _endLiveSessionUseCase: IEndLiveSessionUseCase,
        private _cancelLiveSessionUseCase:ICancelLiveSessionUseCase
    ) { }

    async createLiveSession(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { courseId, scheduledAt, durationInMinutes, description } =
                req.body;

            const instructorId = req.user?.id;
            if (!instructorId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const liveSession = await this._scheduleLiveSessionUseCase.execute({
                courseId,
                instructorId,
                scheduledAt,
                durationInMinutes,
                description,
            });

            res
                .status(STATUS_CODES.CREATED)
                .json(
                    ResponseBuilder.success("Live session created successfully", {
                        liveSession,
                    })
                );
        } catch (err) {
            logger.warn("Failed to create live session.");
            next(err);
        }
    }

    async getSessionsForInstructor(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { query } = GetSessionListForInstructorRequestSchema.parse(req);
            const { page, limit, status, search } = query;

            const instructorId = req.user?.id;
            if (!instructorId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const result = await this._getSessionListForInstructorUseCase.execute({
                page,
                instructorId,
                limit,
                search,
                status,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Fetched live session list successfully", {
                        sessions: result.sessions,
                        totalPages: result.totalPages,
                        totalCount: result.totalCount,
                    })
                );
        } catch (err) {
            logger.warn("Failed to fetch live sessions for instructor.");
            next(err);
        }
    }

    async startLiveSession(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { sessionId } = req.body;

            const instructorId = req.user?.id;
            if (!instructorId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const roomId = await this._startLiveSessionUseCase.execute({
                instructorId,
                sessionId,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Live session started successfully", {
                        roomId,
                    })
                );
        } catch (err) {
            logger.warn("Failed to start live session.");
            next(err);
        }
    }

    async joinLiveSession(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { sessionId } = req.body;

            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const roomId = await this._joinLiveSessionUseCase.execute({
                learnerId,
                sessionId,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Joined live session successfully", {
                        roomId,
                    })
                );
        } catch (err) {
            logger.warn("Failed to join live session.");
            next(err);
        }
    }

    async getSessionsForLearner(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { query } = GetSessionListForLearnerRequestSchema.parse(req);
            const { page, limit, status, courseId } = query;

            const result = await this._getSessionListForLearnerUseCase.execute({
                page,
                limit,
                status,
                courseId,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Fetched live session list successfully", {
                        sessions: result.sessions,
                        totalPages: result.totalPages,
                        totalCount: result.totalCount,
                    })
                );
        } catch (err) {
            logger.warn("Failed to fetch live sessions for learner.");
            next(err);
        }
    }

    async endLiveSession(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { sessionId } = req.body;

            const instructorId = req.user?.id;
            if (!instructorId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            await this._endLiveSessionUseCase.execute({
                instructorId,
                sessionId,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Live session ended successfully")
                );
        } catch (err) {
            logger.warn("Failed to end live session.");
            next(err);
        }
    }

    async cancelLiveSession(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { sessionId } = req.body;

            const instructorId = req.user?.id;
            if (!instructorId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const result= await this._cancelLiveSessionUseCase.execute({
                instructorId,
                sessionId,
            });

            res.status(STATUS_CODES.OK)
                .json(ResponseBuilder.success("Live session cancelled successfully",{
                    liveSession:result
                }));
        } catch (err) {
            logger.warn("Failed to cancel live session.");
            next(err);
        }
    }
}
