import { IGetCertificatesForLearnerUseCase } from "@application/IUseCases/certificate/IGetCertificates";
import { IAddQuizQuestionUseCase } from "@application/IUseCases/course/IAddQuizQuestion";
import { ICreateQuizUseCase } from "@application/IUseCases/course/ICreateQuiz";
import { IDeleteQuizQuestionUseCase } from "@application/IUseCases/course/IDeleteQuestion";
import { IDeleteQuizUseCase } from "@application/IUseCases/course/IDeleteQuiz";
import { IGetQuizForLearnerUseCase } from "@application/IUseCases/course/IGetQuizForLearner";
import { ISubmitQuizAttemptUseCase } from "@application/IUseCases/course/ISubmitQuizAttempt";
import { IUpdateQuizUseCase } from "@application/IUseCases/course/IUpdateQuiz";
import { IUpdateQuizQuestionUseCase } from "@application/IUseCases/course/IUpdateQuizQuestion";
import { logger } from "@infrastructure/logging/Logger";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { NextFunction, Response } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";



export class QuizController {
    constructor(
        private _createQuizUseCase: ICreateQuizUseCase,
        private _updateQuizUseCase: IUpdateQuizUseCase,
        private _addQuizQuestionUseCase: IAddQuizQuestionUseCase,
        private _updateQuestionUseCase: IUpdateQuizQuestionUseCase,
        private _deleteQuestionUseCase: IDeleteQuizQuestionUseCase,
        private _deleteQuizUseCase: IDeleteQuizUseCase,
        private _getQuizForLearnerUseCase: IGetQuizForLearnerUseCase,
        private _submitQuizAttemptUseCase:ISubmitQuizAttemptUseCase,
        private __gerCertificatesUseCase : IGetCertificatesForLearnerUseCase
    ) { }

    async createQuiz(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId } = req.body;

            const result = await this._createQuizUseCase.execute({ courseId });
            res.status(201).json({
                success: true,
                message: "Quiz created successfully.",
                quiz: result
            });

        } catch (error) {
            next(error)
        }
    }

    async updateQuiz(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { quizId, passingScore, timeLimitMinutes } = req.body;

            const result = await this._updateQuizUseCase.execute({ quizId, passingScore, timeLimitMinutes });
            res.status(201).json({
                success: true,
                message: "Quiz updated successfully.",
                quiz: result
            });

        } catch (error) {
            next(error)
        }
    }

    async addQuestion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { quizId, question, options, correctAnswer, points, explanation } = req.body;

            const result = await this._addQuizQuestionUseCase.execute({ quizId, question, options, correctAnswer, points, explanation });
            res.status(201).json({
                success: true,
                message: "Question added successfully.",
                question: result
            });

        } catch (error) {
            next(error)
        }
    }

    async updateQuestion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { questionId, quizId, question, options, correctAnswer, points, explanation } = req.body;

            const result = await this._updateQuestionUseCase.execute({ quizId, questionId, question, options, correctAnswer, points, explanation });
            res.status(201).json({
                success: true,
                message: "Question updated successfully.",
                question: result
            });

        } catch (error) {
            next(error)
        }
    }

    async deleteQuestion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { questionId, quizId } = req.query;
            const result = await this._deleteQuestionUseCase.execute({
                quizId: quizId as string,
                questionId: questionId as string
            });
            res.status(201).json({
                success: true,
                message: "Question deleted successfully.",
                question: result
            });

        } catch (error) {
            next(error)
        }
    }

    async deleteQuiz(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, quizId } = req.query;


            const result = await this._deleteQuizUseCase.execute({
                quizId: quizId as string,
                courseId: courseId as string
            });
            res.status(201).json({
                success: true,
                message: "Quiz deleted successfully.",
                question: result
            });

        } catch (error) {
            next(error)
        }
    }

    async getQuizForLearner(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info("Request recieved to get quiz.");

            const { courseId } = req.query;
            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const response = await this._getQuizForLearnerUseCase.execute({ 
                courseId :courseId as string,
                learnerId
            });
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Fetched quiz data successfully",
                quiz: response
            })

        } catch (err) {
            next(err)
        }
    }

    async submitQuiz(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { quizId,courseId,answers } = req.body;
            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const result = await this._submitQuizAttemptUseCase.execute({ quizId,courseId,learnerId, answers});
            res.status(201).json({
                success: true,
                message: "Quiz submitted successfully.",
                quizAttempt: result.quizAttempt
            });

        } catch (error) {
            next(error)
        }
    }

    async getCertificates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { page,limit } = req.params;
            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const result = await this.__gerCertificatesUseCase.execute({ 
                learnerId,
                page:Number(page) ,
                limit:Number(limit)} );
            res.status(201).json({
                success: true,
                message: "Fetched certificates successfully.",
                certificates:result.certificates,
                totalCount:result.totalCount,
                totalPages:result.totalPages

            });

        } catch (error) {
            next(error)
        }
    }
}

