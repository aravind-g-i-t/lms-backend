
import { NextFunction, Response } from "express";
import { GetLearnersRequestSchema, GetLearnersResponseDTO } from "@presentation/dtos/learner/GetLearners";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IGetLearnerDataUseCase } from "@application/IUseCases/learner/IGetLearnerData";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IUpdateLearnerDataUseCase } from "@application/IUseCases/learner/IUpdateLearnerData";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IGetLearnersUseCase } from "@application/IUseCases/learner/IGetLearners";
import { GetLearnerProfileResponseDTO } from "@presentation/dtos/learner/GetProfile";
import { AuthenticatedRequest } from "@presentation/middlewares/createAuthMiddleware";
import { AppError } from "shared/errors/AppError";
import { logger } from "@infrastructure/logging/Logger";

export class LearnerController {
    constructor(
        private _getLearnersUseCase: IGetLearnersUseCase,
        private _updateLearnerStatusUseCase: IUpdateUserStatusUseCase,
        private _updateLearnerDataUseCase: IUpdateLearnerDataUseCase,
        private _updatePassword: IUpdateUserPassword,
        private _getLearnerData: IGetLearnerDataUseCase,
    ) { }

    getLearners = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

        try {

            logger.info("Request recieved to fetch learners for listing.");
            const { query } = GetLearnersRequestSchema.parse(req);

            const { page, search, status, limit } = query
            const result = await this._getLearnersUseCase.execute({ page, search, status, limit });

            const response: GetLearnersResponseDTO = {
                success: true,
                message: MESSAGES.LEARNERS_FETCHED,
                learners: result.learners,
                totalCount: result.totalCount,
                totalPages: result.totalPages
            }
            logger.info("Learner fetched for listing successfully.")
            res.status(STATUS_CODES.OK).json(response);

        } catch (error) {

            logger.warn("Failed to fetch Learners for listing.")
            next(error)

        }

    }


    updateLearnerStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update learner status");
            const id = req.body.id
            await this._updateLearnerStatusUseCase.execute(id);
            logger.info("Updated learner status successfully.");
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.LEARNER_UPDATED })
        } catch (error) {
            logger.warn("Failed to update learner status.")
            next(error)
        }
    }

    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update learner profile");
            const { name } = req.body;
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateLearnerDataUseCase.execute(id, { name });
            const response = { success: true, message: MESSAGES.LEARNER_UPDATED };
            logger.info("Learner profile updated successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update learner profile.")
            next(error)
        }
    }

    updateProfileImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update learner profile image.");
            const { imageURL } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateLearnerDataUseCase.execute(id, { profilePic: imageURL });
            const response = { success: true, message: MESSAGES.LEARNER_UPDATED };
            logger.info("Learner profile image updated successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update learner profile image .")
            next(error)
        }
    }

    updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update learner password.");
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const { currentPassword, newPassword } = req.body;

            await this._updatePassword.execute(id, currentPassword, newPassword);
            logger.info("Learner password updated successfully");
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.LEARNER_UPDATED })
        } catch (error) {
            logger.warn("Failed to update learner password.")
            next(error)
        }
    }

    getLearnerProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to get learner data for profile.");
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const result = await this._getLearnerData.execute(id);
            const response: GetLearnerProfileResponseDTO = {
                success: true,
                message: MESSAGES.LEARNER_UPDATED,
                learner: result
            };
            logger.info("Learner data fetched successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to get learner data for profile.")
            next(error)
        }
    }


    getLearnerDataForAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to get learner data for admin");
            const id = req.params.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const result = await this._getLearnerData.execute(id);
            const response: GetLearnerProfileResponseDTO = {
                success: true,
                message: MESSAGES.LEARNER_UPDATED,
                learner: result
            };
            logger.info("Leaner data was fetched successfully.");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to fetch learner data for admin.")
            next(error)
        }
    }


}