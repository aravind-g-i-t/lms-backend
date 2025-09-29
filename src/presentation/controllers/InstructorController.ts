import { Response, NextFunction } from "express";
import { GetInstructorsRequestSchema, GetInstructorsResponseDTO } from "@application/dtos/instructor/GetInstructors";
import { MESSAGES } from "shared/constants/messages";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IGetInstructorsUseCase } from "@application/IUseCases/instructor/IGetInstructors";
import { IGetInstructorDataUseCase } from "@application/IUseCases/instructor/IGetInstructorData";
import { GetLearnerProfileResponseDTO } from "@application/dtos/learner/GetProfile";
import { GetInstructorProfileDTO, GetInstructorProfileResponseDTO } from "@application/dtos/instructor/GetProfile";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IUpdateInstructorDataUseCase } from "@application/IUseCases/instructor/IUpdateInstructorData";
import { IInstructorApplyForVeficationUseCase } from "@application/IUseCases/instructor/IApplyForVerification";
import { AppError } from "shared/errors/AppError";
import { AuthenticatedRequest } from "@presentation/middlewares/createAuthMiddleware";

export class InstructorController {
    constructor(
        private _getInstructorsUseCase: IGetInstructorsUseCase,
        private _updateInstructorStatusUseCase: IUpdateUserStatusUseCase,
        private _getInstructorData: IGetInstructorDataUseCase,
        private _updateInstructorDataUseCase: IUpdateInstructorDataUseCase,
        private _updateInstructorPasswordUseCase: IUpdateUserPassword,
        private _applyForVerificationUseCase: IInstructorApplyForVeficationUseCase,

    ) { }

    getInstructors = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { query } = GetInstructorsRequestSchema.parse(req);
            console.log(query);
            

            const { page, search, status, limit } = query
            const result = await this._getInstructorsUseCase.execute({
                page,
                search,
                status,
                limit
            });

            const response: GetInstructorsResponseDTO = {
                success: true,
                message: MESSAGES.INSTRUCTOR_FETCHED,
                instructors: result.instructors.map(instructor => InstructorDTOMapper.toGetInstructorsDTO(instructor)),
                totalCount: result.totalCount,
                totalPages: result.totalPages
            }

            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

    updateInstructorStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateInstructorStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.INSTRUCTOR_UPDATED })
        } catch (error) {
            next(error)
        }
    }

    getInstructorProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const instructorData = await this._getInstructorData.execute(id);
            const response: GetInstructorProfileResponseDTO = {
                success: true,
                message: MESSAGES.INSTRUCTOR_UPDATED,
                instructor: InstructorDTOMapper.toGetInstructorProfile(instructorData)
            };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }


    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const { data } = req.body;

            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, data);
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }


    updateProfileImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const { imageURL } = req.body;

            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, { profilePic: imageURL });
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updateExpertise = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const { expertise } = req.body;

            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, { expertise });
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updateResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const { resume } = req.body;

            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateInstructorDataUseCase.execute(id, { resume });
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { currentPassword, newPassword } = req.body;
            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateInstructorPasswordUseCase.execute(id, currentPassword, newPassword);
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.INSTRUCTOR_UPDATED })
        } catch (error) {
            next(error)
        }
    }

    applyForVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            let id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._applyForVerificationUseCase.execute(id);

            const response = { success: true, message: MESSAGES.SEND_VERIFICATION_SUCCESS };
            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    
}

