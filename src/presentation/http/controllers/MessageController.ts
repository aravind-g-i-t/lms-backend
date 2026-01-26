import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { logger } from "@infrastructure/logging/Logger";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";

import { IDeleteMessagesForEveryoneUseCase } from "@application/IUseCases/message/IDeleteForEveryone";
import { IDeleteMessagesForMeUseCase } from "@application/IUseCases/message/IDeleteForMe";
import { IGetInstructorConversationsUseCase } from "@application/IUseCases/message/IGetInstructorConversations";
import { IGetLearnerConversationsUseCase } from "@application/IUseCases/message/IGetLearnerConversations";
import { IGetMessagesUseCase } from "@application/IUseCases/message/IGetMessages";
import { IGetVideoCallTokenUseCase } from "@application/IUseCases/videoCall/IGetVideoCallToken";

export class MessageController {
  constructor(
    private _getLearnerConversationsUseCase: IGetLearnerConversationsUseCase,
    private _getMessagesUseCase: IGetMessagesUseCase,
    private _getInstructorConversationsUseCase: IGetInstructorConversationsUseCase,
    private _getVideoCallToken: IGetVideoCallTokenUseCase,
    private _deleteForMeUseCase: IDeleteMessagesForMeUseCase,
    private _deleteForEveryoneUseCase: IDeleteMessagesForEveryoneUseCase
  ) {}

  async getConversationsForLearner(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const learnerId = req.user?.id;
      if (!learnerId) {
        throw new AppError(
          MESSAGES.SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const { courseId } = req.query;

      const result = await this._getLearnerConversationsUseCase.execute({
        learnerId,
        courseId: courseId as string | undefined,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Conversations fetched successfully", {
            conversations: result.conversations,
            messages: result.messages,
          })
        );
    } catch (err) {
      logger.warn("Failed to fetch conversations for learner.");
      next(err);
    }
  }

  async getMessages(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          MESSAGES.SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const { conversationId, limit, offset } = req.query;

      const result = await this._getMessagesUseCase.execute({
        userId,
        conversationId: conversationId as string,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Messages fetched successfully", {
            messages: result.messages,
            hasMore: result.hasMore,
          })
        );
    } catch (err) {
      logger.warn("Failed to fetch messages.");
      next(err);
    }
  }

  async getConversationsForInstructor(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const instructorId = req.user?.id;
      if (!instructorId) {
        throw new AppError(
          MESSAGES.SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const { courseId, learnerId, page, limit, search, selectedCourse } =
        req.query;

      const result = await this._getInstructorConversationsUseCase.execute({
        instructorId,
        courseId: courseId as string | undefined,
        learnerId: learnerId as string | undefined,
        page: Number(page),
        limit: Number(limit),
        search: search as string | undefined,
        selectedCourse: selectedCourse as string | undefined,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Conversations fetched successfully", {
            conversations: result.conversations,
            messages: result.messages,
            courses: result.courses,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
          })
        );
    } catch (err) {
      logger.warn("Failed to fetch conversations for instructor.");
      next(err);
    }
  }

  async getVideoCallToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          MESSAGES.SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const { roomId } = req.body;

      const token = await this._getVideoCallToken.execute(userId, roomId);

      res
        .status(STATUS_CODES.CREATED)
        .json(
          ResponseBuilder.success(
            "Video-call token generated successfully",
            { token }
          )
        );
    } catch (err) {
      logger.warn("Failed to get video call token.");
      next(err);
    }
  }

  async deleteMessages(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(
          MESSAGES.SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const { messageIds, scope } = req.body;

      if (scope === "ME") {
        await this._deleteForMeUseCase.execute({ userId, messageIds });
      }

      if (scope === "EVERYONE") {
        await this._deleteForEveryoneUseCase.execute({ userId, messageIds });
      }

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Messages deleted successfully")
        );
    } catch (err) {
      logger.warn("Failed to delete messages.");
      next(err);
    }
  }
}
