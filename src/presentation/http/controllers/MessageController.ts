import { IGetInstructorConversationsUseCase } from "@application/IUseCases/message/IGetInstructorConversations";
import { IGetLearnerConversationsUseCase } from "@application/IUseCases/message/IGetLearnerConversations";
import { IGetMessagesUseCase } from "@application/IUseCases/message/IGetMessages";
import { logger } from "@infrastructure/logging/Logger";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { NextFunction, Response } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";



export class MessageController {
    constructor(

        private _getLearnerConversationsUseCase: IGetLearnerConversationsUseCase,
        private _getMessagesUseCase: IGetMessagesUseCase,
        private _getInstructorConversationsUseCase: IGetInstructorConversationsUseCase
    ) { }



    async getConversationsForLearner(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId } = req.query;
            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const result = await this._getLearnerConversationsUseCase.execute({
                courseId: courseId as string | undefined,
                learnerId
            });

            res.status(STATUS_CODES.CREATED).json({
                success: true,
                message: "Conversations fetched successfully",
                conversations: result.conversations,
                messages: result.messages
            });
        } catch (err) {
            logger.warn("Failed to fetch conversations.")
            next(err)
        }
    }

    async getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { conversationId, limit, offset } = req.query;
            console.log(conversationId);

            const result = await this._getMessagesUseCase.execute({
                conversationId: conversationId as string,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined
            });

            res.status(STATUS_CODES.CREATED).json({
                success: true,
                message: "Messages fetched successfully",
                messages:result.messages,
                hasMore:result.hasMore
            });
        } catch (err) {
            logger.warn("Failed to fetch messages.")
            next(err)
        }
    }

    async getConversationsForInstructor(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { courseId ,learnerId,page,limit,search,selectedCourse} = req.query;
            console.log(req.query)
            const instructorId = req.user?.id
            if (!instructorId) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const result = await this._getInstructorConversationsUseCase.execute({ 
                instructorId,
                courseId:courseId as string|undefined,
                learnerId:learnerId as string|undefined,
                page:Number(page),
                limit:Number(limit),
                search:search as string|undefined,
                selectedCourse:selectedCourse as string|undefined
            });

            res.status(STATUS_CODES.CREATED).json({
                success: true,
                message: "Conversations fetched successfully",
                conversations:result.conversations,
                messages:result.messages,
                courses:result.courses,
                totalPages:result.totalPages,
                totalCount:result.totalCount
            });
        } catch (err) {
            logger.warn("Failed to fetch conversations.")
            next(err)
        }
    }
}