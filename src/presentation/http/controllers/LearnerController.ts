import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";
import { GetLearnersRequestSchema } from "@presentation/dtos/learner/GetLearners";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IGetLearnersUseCase } from "@application/IUseCases/learner/IGetLearners";
import { IGetLearnerDataUseCase } from "@application/IUseCases/learner/IGetLearnerData";
import { IUpdateLearnerDataUseCase } from "@application/IUseCases/learner/IUpdateLearnerData";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IAddtoFavouritesUseCase } from "@application/IUseCases/favourite/IAddToFavourites";
import { IRemoveFromFavouritesUseCase } from "@application/IUseCases/favourite/IRemoveFromFavourites";
import { AppError } from "shared/errors/AppError";
import { logger } from "@infrastructure/logging/Logger";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";

export class LearnerController {
    constructor(
        private _getLearnersUseCase: IGetLearnersUseCase,
        private _updateLearnerStatusUseCase: IUpdateUserStatusUseCase,
        private _updateLearnerDataUseCase: IUpdateLearnerDataUseCase,
        private _updatePassword: IUpdateUserPassword,
        private _getLearnerData: IGetLearnerDataUseCase,
        private _addToFavouritesUseCase: IAddtoFavouritesUseCase,
        private _removeFromFavouritesUseCase: IRemoveFromFavouritesUseCase
    ) { }

    getLearners = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            logger.info("Request received to fetch learners for listing.");

            const { query } = GetLearnersRequestSchema.parse(req);
            const { page, search, status, limit } = query;

            const result = await this._getLearnersUseCase.execute({
                page,
                search,
                status,
                limit,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success(MESSAGES.LEARNERS_FETCHED, {
                        learners: result.learners,
                        totalCount: result.totalCount,
                        totalPages: result.totalPages,
                    })
                );
        } catch (error) {
            logger.warn("Failed to fetch learners for listing.");
            next(error);
        }
    };

    updateLearnerStatus = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.body;
            await this._updateLearnerStatusUseCase.execute(id);

            res
                .status(STATUS_CODES.OK)
                .json(ResponseBuilder.success(MESSAGES.LEARNER_UPDATED));
        } catch (error) {
            logger.warn("Failed to update learner status.");
            next(error);
        }
    };

    updateProfile = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            await this._updateLearnerDataUseCase.execute(learnerId, {
                name: req.body.name,
            });

            res
                .status(STATUS_CODES.OK)
                .json(ResponseBuilder.success(MESSAGES.LEARNER_UPDATED));
        } catch (error) {
            logger.warn("Failed to update learner profile.");
            next(error);
        }
    };

    updateProfileImage = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            await this._updateLearnerDataUseCase.execute(learnerId, {
                profilePic: req.body.imageURL,
            });

            res
                .status(STATUS_CODES.OK)
                .json(ResponseBuilder.success(MESSAGES.LEARNER_UPDATED));
        } catch (error) {
            logger.warn("Failed to update learner profile image.");
            next(error);
        }
    };

    updatePassword = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const { currentPassword, newPassword } = req.body;
            await this._updatePassword.execute(
                learnerId,
                currentPassword,
                newPassword
            );

            res
                .status(STATUS_CODES.OK)
                .json(ResponseBuilder.success(MESSAGES.LEARNER_UPDATED));
        } catch (error) {
            logger.warn("Failed to update learner password.");
            next(error);
        }
    };

    getLearnerProfile = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const learner = await this._getLearnerData.execute(learnerId);

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Learner details fetched", {
                        learner,
                    })
                );
        } catch (error) {
            logger.warn("Failed to get learner data for profile.");
            next(error);
        }
    };

    getLearnerDataForAdmin = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            const learner = await this._getLearnerData.execute(id);

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Learner details fetched", {
                        learner,
                    })
                );
        } catch (error) {
            logger.warn("Failed to fetch learner data for admin.");
            next(error);
        }
    };

    addToFavourites = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            await this._addToFavouritesUseCase.execute({
                learnerId,
                courseId: req.body.courseId,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Course added to favourites successfully")
                );
        } catch (error) {
            logger.warn("Failed to add course to favourites.");
            next(error);
        }
    };

    removeFromFavourites = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const learnerId = req.user?.id;
            if (!learnerId) {
                throw new AppError(
                    MESSAGES.SERVER_ERROR,
                    STATUS_CODES.INTERNAL_SERVER_ERROR
                );
            }

            await this._removeFromFavouritesUseCase.execute({
                learnerId,
                courseId: req.params.courseId,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success(
                        "Course removed from favourites successfully"
                    )
                );
        } catch (error) {
            logger.warn("Failed to remove course from favourites.");
            next(error);
        }
    };

    
}
