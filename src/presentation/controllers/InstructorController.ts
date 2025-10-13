import { Response, NextFunction } from "express";
import { GetInstructorsRequestSchema, GetInstructorsResponseDTO } from "@presentation/dtos/instructor/GetInstructors";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IGetInstructorsUseCase } from "@application/IUseCases/instructor/IGetInstructors";
import { IGetInstructorDataUseCase } from "@application/IUseCases/instructor/IGetInstructorData";
import { GetInstructorProfileResponseDTO } from "@presentation/dtos/instructor/GetProfile";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IUpdateInstructorDataUseCase } from "@application/IUseCases/instructor/IUpdateInstructorData";
import { IInstructorApplyForVeficationUseCase } from "@application/IUseCases/instructor/IApplyForVerification";
import { AppError } from "shared/errors/AppError";
import { AuthenticatedRequest } from "@presentation/middlewares/createAuthMiddleware";
import { logger } from "@infrastructure/logging/Logger";
import { IUpdateInstructorVerificationStatusUseCase } from "@application/IUseCases/instructor/IUpdateVerificationStatus";

export class InstructorController {
    constructor(
        private _getInstructorsUseCase: IGetInstructorsUseCase,
        private _updateInstructorStatusUseCase: IUpdateUserStatusUseCase,
        private _getInstructorData: IGetInstructorDataUseCase,
        private _updateInstructorDataUseCase: IUpdateInstructorDataUseCase,
        private _updateInstructorPasswordUseCase: IUpdateUserPassword,
        private _applyForVerificationUseCase: IInstructorApplyForVeficationUseCase,
        private _updateVerificationStatusUseCase:IUpdateInstructorVerificationStatusUseCase

    ) { }

    getInstructors = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Request recieved to get instructors for listing");
            const { query } = GetInstructorsRequestSchema.parse(req);            

            const { page, search, status, limit ,verificationStatus} = query
            const result = await this._getInstructorsUseCase.execute({page,search,status,limit,verificationStatus});

            const response: GetInstructorsResponseDTO = {
                success: true,
                message: MESSAGES.INSTRUCTOR_FETCHED,
                instructors: result.instructors,
                totalCount: result.totalCount,
                totalPages: result.totalPages
            }
            logger.info("Instructor fetched for listing successfully.")
            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            logger.warn("Failed to fetch instructors for listing.")
            next(error)
        }
    }

    updateInstructorStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update instructor status");
            const id = req.body.id;
            
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateInstructorStatusUseCase.execute(id);
            logger.info("Updated instructor status successfully.");
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.INSTRUCTOR_UPDATED })
        } catch (error) {
            logger.warn("Failed to update instructor status.");
            next(error)
        }
    }

    getInstructorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to get instructor data for profile.");
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const instructorData = await this._getInstructorData.execute(id);
            const response: GetInstructorProfileResponseDTO = {
                success: true,
                message: MESSAGES.INSTRUCTOR_UPDATED,
                instructor:instructorData
            };
            logger.info("Instructor data fetched successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to get instructor data for profile.")
            next(error)
        }
    }
    
    
    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update Instructor profile");
            const { name,designation,website,bio } = req.body;
            
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            
            await this._updateInstructorDataUseCase.execute(id, {name,designation,website,bio});
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            logger.info("Instructor profile updated successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update instructor profile.")
            next(error)
        }
    }
    
    
    updateProfileImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update Instructor profile image.");
            const { imageURL } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, { profilePic: imageURL });
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            logger.info("Instructor profile image updated successfully");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update instructor profile image.")
            next(error)
        }
    }

    updateExpertise = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update instructor expertise.")
            const { expertise } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, { expertise });
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            logger.info("Instructor expertise updated successfully.")
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update instructor expertise.")
            next(error)
        }
    }

    updateResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update instructor resume.")
            const { resume } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, { resume });
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            logger.info("Instructor resume updated successfully.")
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update instructor resume.")
            next(error)
        }
    }

    updateIDProof = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update instructor identity proof.")
            const { identityProof } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, { identityProof });
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            logger.info("Instructor identity proof updated successfully.")
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to update instructor identity proof.")
            next(error)
        }
    }

    updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update Instructor password.");
            const { currentPassword, newPassword } = req.body;
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateInstructorPasswordUseCase.execute(id, currentPassword, newPassword);
            logger.info("Instructor password updated successfully");
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.INSTRUCTOR_UPDATED })
        } catch (error) {
            logger.warn("Failed to update instructor password.")
            next(error)
        }
    }

    applyForVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to apply for instructor verification.")
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._applyForVerificationUseCase.execute(id);

            const response = { success: true, message: MESSAGES.SEND_VERIFICATION_SUCCESS };
            logger.info("Applied for Business verification successfully.")
            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            logger.warn("Failed to apply for  instructor verification.")
            next(error)
        }
    }

    getInstructorProfileForAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to get Instructor data for admin");
            const id = req.params.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const instructorData = await this._getInstructorData.execute(id);
            const response: GetInstructorProfileResponseDTO = {
                success: true,
                message: MESSAGES.INSTRUCTOR_UPDATED,
                instructor: instructorData
            };
            logger.info("Leaner data was fetched successfully.");
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            logger.warn("Failed to get instructor data for admin.")
            next(error)
        }
    }

    updateVerificationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            logger.info("Request recieved to update instructor verification status.")
            const { id, status, remarks } = req.body;
            await this._updateVerificationStatusUseCase.execute({ id, status, remarks });

            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            logger.info("Instructor verification status updated successfully.")
            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            logger.warn("Failed to update instructor verification status.")
            next(error);
        }
    }
}


