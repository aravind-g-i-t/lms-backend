import { Response, NextFunction } from "express";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { GetBusinessesRequestSchema, GetBusinessesResponseDTO } from "@presentation/dtos/business/GetBusinesses";
import { IGetBusinessesUseCase } from "@application/IUseCases/business/IGetBusinesses";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { GetBusinessProfileResponseDTO } from "@presentation/dtos/business/GetProfile";
import { IGetBusinessDataUseCase } from "@application/IUseCases/business/IGetBusinessData";
import { IUpdateBusinessDataUseCase } from "@application/IUseCases/business/IUpdateBusinessData";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";

import { AppError } from "shared/errors/AppError";
import { IApplyForBusinessVeficationUseCase } from "@application/IUseCases/business/IBusinessApplyForVerification";
import { IUpdateBusinessVerificationStatusUseCase } from "@application/IUseCases/business/IUpdateVerificationStatus";
import { logger } from "@infrastructure/logging/Logger";

export class BusinessController {
    constructor(
        private _getBusinessesUseCase: IGetBusinessesUseCase,
        private _updateBusinessStatusUseCase: IUpdateUserStatusUseCase,
        private _getBusinessDataUseCase: IGetBusinessDataUseCase,
        private _updateBusinessDataUseCase: IUpdateBusinessDataUseCase,
        private _updateBusinessPasswordUseCase: IUpdateUserPassword,
        private _applyForVerificationUseCase: IApplyForBusinessVeficationUseCase,
        private _updateVerificationStatusUseCase: IUpdateBusinessVerificationStatusUseCase
    ) { }

    getBusinesses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Request recieved to get businesses for listing");
            const { query } = GetBusinessesRequestSchema.parse(req);

            const { page, search, status, limit, verificationStatus } = query
            const result = await this._getBusinessesUseCase.execute({ page, search, status, limit, verificationStatus });

            const response: GetBusinessesResponseDTO = {
                success: true,
                message: MESSAGES.BUSINESS_FETCHED,
                businesses: result.businesses,
                totalCount: result.totalCount,
                totalPages: result.totalPages
            }
            logger.info("Business fetched for listing successfully.")
            res.status(STATUS_CODES.OK).json(response);

        } catch (error) {
            logger.warn("Failed to fetch businesses for listing.")
            next(error)
        }
    }

    updateBusinessStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update business status");
            const id = req.body.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessStatusUseCase.execute(id);
            logger.info("Updated business status successfully.");
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.BUSINESS_UPDATED })
        } catch (error) {
            logger.warn("Failed to update business status")
            next(error)
        }
    }

    getBusinessProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to get business data for profile.");
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const result = await this._getBusinessDataUseCase.execute(id);
            const response: GetBusinessProfileResponseDTO = {
                success: true,
                message: MESSAGES.BUSINESS_UPDATED,
                business: result
            };
            logger.info("Business data fetched successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to get business data for profile.")
            next(error)
        }
    }

    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update business profile");
            const { name, businessDomain, website, location } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateBusinessDataUseCase.execute(id, { name, businessDomain, website, location });
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            logger.info("Business profile updated successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update business profile")
            next(error)
        }
    }

    updateProfileImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update business profile image.");
            const { imageURL } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessDataUseCase.execute(id, { profilePic: imageURL });
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            logger.info("Business profile image updated successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update business profile image.")
            next(error)
        }
    }

    updateLicense = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update business license.")
            const { license } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessDataUseCase.execute(id, { license });
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            logger.info("Business license updated successfully.")
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update business license.")
            next(error)
        }
    }

    updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update business password.");
            const { currentPassword, newPassword } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessPasswordUseCase.execute(id, currentPassword, newPassword);
            logger.info("Business password updated successfully");
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.BUSINESS_UPDATED })
        } catch (error) {
            logger.warn("Failed to update business password.")
            next(error)
        }
    }


    applyForVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to apply for business verification.")
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._applyForVerificationUseCase.execute(id);

            const response = { success: true, message: MESSAGES.SEND_VERIFICATION_SUCCESS };
            logger.info("Applied for Business verification successfully.")
            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            logger.warn("Failed to apply for Business verification.")
            next(error)
        }
    }

    getBusinessDataForAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to fetch business data for admin.")
            const id = req.params.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const result = await this._getBusinessDataUseCase.execute(id);
            const response: GetBusinessProfileResponseDTO = {
                success: true,
                message: MESSAGES.BUSINESS_UPDATED,
                business: result
            };
            logger.info("Business data fetched successfully.")
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to fetch business data for admin");

            next(error)
        }
    }


    updateVerificationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update business verification status.")
            const { id, status, remarks } = req.body;
            await this._updateVerificationStatusUseCase.execute({ id, status, remarks });

            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            logger.info("Business verification status updated successfully.")
            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            logger.warn("Failed to update business verification status.")
            next(error)
        }
    }

}