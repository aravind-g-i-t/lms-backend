import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { logger } from "@infrastructure/logging/Logger";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";

import { ICreateQuizUseCase } from "@application/IUseCases/course/ICreateQuiz";
import { IUpdateQuizUseCase } from "@application/IUseCases/course/IUpdateQuiz";
import { IAddQuizQuestionUseCase } from "@application/IUseCases/course/IAddQuizQuestion";
import { IUpdateQuizQuestionUseCase } from "@application/IUseCases/course/IUpdateQuizQuestion";
import { IDeleteQuizQuestionUseCase } from "@application/IUseCases/course/IDeleteQuestion";
import { IDeleteQuizUseCase } from "@application/IUseCases/course/IDeleteQuiz";
import { IGetQuizForLearnerUseCase } from "@application/IUseCases/course/IGetQuizForLearner";
import { ISubmitQuizAttemptUseCase } from "@application/IUseCases/course/ISubmitQuizAttempt";
import { IGetCertificatesForLearnerUseCase } from "@application/IUseCases/certificate/IGetCertificates";

export class QuizController {
  constructor(
    private _createQuizUseCase: ICreateQuizUseCase,
    private _updateQuizUseCase: IUpdateQuizUseCase,
    private _addQuizQuestionUseCase: IAddQuizQuestionUseCase,
    private _updateQuestionUseCase: IUpdateQuizQuestionUseCase,
    private _deleteQuestionUseCase: IDeleteQuizQuestionUseCase,
    private _deleteQuizUseCase: IDeleteQuizUseCase,
    private _getQuizForLearnerUseCase: IGetQuizForLearnerUseCase,
    private _submitQuizAttemptUseCase: ISubmitQuizAttemptUseCase,
    private _getCertificatesUseCase: IGetCertificatesForLearnerUseCase
  ) {}

  async createQuiz(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.body;

      const quiz = await this._createQuizUseCase.execute({ courseId });

      res
        .status(STATUS_CODES.CREATED)
        .json(
          ResponseBuilder.success("Quiz created successfully", { quiz })
        );
    } catch (error) {
      next(error);
    }
  }

  async updateQuiz(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quizId, passingScore, timeLimitMinutes } = req.body;

      const quiz = await this._updateQuizUseCase.execute({
        quizId,
        passingScore,
        timeLimitMinutes,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Quiz updated successfully", { quiz })
        );
    } catch (error) {
      next(error);
    }
  }

  async addQuestion(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        quizId,
        question,
        options,
        correctAnswer,
        points,
        explanation,
      } = req.body;

      const createdQuestion = await this._addQuizQuestionUseCase.execute({
        quizId,
        question,
        options,
        correctAnswer,
        points,
        explanation,
      });

      res
        .status(STATUS_CODES.CREATED)
        .json(
          ResponseBuilder.success("Question added successfully", {
            question: createdQuestion,
          })
        );
    } catch (error) {
      next(error);
    }
  }

  async updateQuestion(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        questionId,
        quizId,
        question,
        options,
        correctAnswer,
        points,
        explanation,
      } = req.body;

      const updatedQuestion = await this._updateQuestionUseCase.execute({
        quizId,
        questionId,
        question,
        options,
        correctAnswer,
        points,
        explanation,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Question updated successfully", {
            question: updatedQuestion,
          })
        );
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { questionId, quizId } = req.query;

      await this._deleteQuestionUseCase.execute({
        quizId: quizId as string,
        questionId: questionId as string,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Question deleted successfully")
        );
    } catch (error) {
      next(error);
    }
  }

  async deleteQuiz(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId, quizId } = req.query;

      await this._deleteQuizUseCase.execute({
        quizId: quizId as string,
        courseId: courseId as string,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Quiz deleted successfully")
        );
    } catch (error) {
      next(error);
    }
  }

  async getQuizForLearner(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info("Request received to get quiz.");

      const learnerId = req.user?.id;
      if (!learnerId) {
        throw new AppError(
          MESSAGES.SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const { courseId } = req.query;

      const quiz = await this._getQuizForLearnerUseCase.execute({
        courseId: courseId as string,
        learnerId,
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Fetched quiz data successfully", {
            quiz,
          })
        );
    } catch (error) {
      next(error);
    }
  }

  async submitQuiz(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quizId, courseId, answers } = req.body;

      const learnerId = req.user?.id;
      if (!learnerId) {
        throw new AppError(
          MESSAGES.SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }

      const result = await this._submitQuizAttemptUseCase.execute({
        quizId,
        courseId,
        learnerId,
        answers,
      });

      res
        .status(STATUS_CODES.CREATED)
        .json(
          ResponseBuilder.success("Quiz submitted successfully", {
            quizAttempt: result.quizAttempt,
          })
        );
    } catch (error) {
      next(error);
    }
  }

  async getCertificates(
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

      const { page, limit } = req.params;

      const result = await this._getCertificatesUseCase.execute({
        learnerId,
        page: Number(page),
        limit: Number(limit),
      });

      res
        .status(STATUS_CODES.OK)
        .json(
          ResponseBuilder.success("Fetched certificates successfully", {
            certificates: result.certificates,
            totalCount: result.totalCount,
            totalPages: result.totalPages,
          })
        );
    } catch (error) {
      next(error);
    }
  }
}
