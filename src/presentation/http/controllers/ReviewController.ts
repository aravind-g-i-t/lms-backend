import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/createAuthMiddleware";
import { ICreateReviewUseCase } from "@application/IUseCases/review/ICreateReview";
import { IGetReviewsForLearnerUseCase } from "@application/IUseCases/review/IGetReviewsForLearner";
import { GetReviewsForLearnerRequestSchema } from "@presentation/dtos/review/GetReviewsForLearner";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";
import { IUpdateReviewUseCase } from "@application/IUseCases/review/IUpdateReview";

export class ReviewController {
    constructor(
        private _createReviewUseCase: ICreateReviewUseCase,
        private _getReviewsForLearnerUseCase: IGetReviewsForLearnerUseCase,
        private _updateReviewUseCase: IUpdateReviewUseCase
    ) { }

    async addReview(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { courseId, rating, reviewText } = req.body;

            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.LEARNER_NOT_FOUND,
                    STATUS_CODES.NOT_FOUND
                );
            }

            const review = await this._createReviewUseCase.execute({
                courseId,
                learnerId,
                rating,
                reviewText,
            });

            res
                .status(STATUS_CODES.CREATED)
                .json(
                    ResponseBuilder.success("Review created successfully", {
                        review,
                    })
                );
        } catch (error) {
            next(error);
        }
    }

    async getReviewsForLearner(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { query } = GetReviewsForLearnerRequestSchema.parse(req);
            const { skip, limit, courseId,learnerId } = query;

            // const learnerId = req.user?.id;
            // if (!learnerId) {
            //     throw new AppError(
            //         MESSAGES.SERVER_ERROR,
            //         STATUS_CODES.INTERNAL_SERVER_ERROR
            //     );
            // }

            const result = await this._getReviewsForLearnerUseCase.execute({
                courseId,
                learnerId,
                limit,
                skip,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Reviews fetched successfully", {
                        myReview: result.myReview,
                        reviews: result.reviews,
                    })
                );
        } catch (error) {
            next(error);
        }
    }

    async updateReview(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log("Entered controller");

            const { courseId, rating, reviewText } = req.body;

            console.log(req.body);
            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const review = await this._updateReviewUseCase.execute({
                courseId,
                learnerId,
                rating,
                reviewText,
            });

            res.status(STATUS_CODES.CREATED)
                .json(
                    ResponseBuilder.success("Review created successfully", {
                        review,
                    })
                );
        } catch (error) {
            next(error);
        }
    }
}
