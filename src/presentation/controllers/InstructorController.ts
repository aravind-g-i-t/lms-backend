import { Request, Response, NextFunction } from "express";
import { GetInstructorsRequestSchema, GetInstructorsResponseDTO } from "@application/dtos/instructor/GetInstructors";
import { GetInstructorsUseCase } from "@application/useCases/instructor/GetInstructors";
import { MESSAGES } from "shared/constants/messages";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { UpdateInstructorStatusUseCase } from "@application/useCases/instructor/UpdateInstructorStatus";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IGetInstructorsUseCase } from "@application/IUseCases/instructor/IGetInstructors";
import { IGetInstructorDataUseCase } from "@application/IUseCases/instructor/IGetInstructorData";
import { GetLearnerProfileResponseDTO } from "@application/dtos/learner/GetProfile";
import { GetInstructorProfileDTO, GetInstructorProfileResponseDTO } from "@application/dtos/instructor/GetProfile";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IUpdateInstructorDataUseCase } from "@application/IUseCases/instructor/IUpdateInstructorData";
import { IInstructorApplyForVeficationUseCase } from "@application/IUseCases/instructor/IApplyForVerification";

export class InstructorController {
    constructor(
        private _getInstructorsUseCase: IGetInstructorsUseCase,
        private _updateInstructorStatusUseCase: IUpdateUserStatusUseCase,
        private _getInstructorData: IGetInstructorDataUseCase,
        private _updateInstructorDataUseCase: IUpdateInstructorDataUseCase,
        private _updateInstructorPasswordUseCase: IUpdateUserPassword,
        private _applyForVerificationUseCase:IInstructorApplyForVeficationUseCase


    ) { }

    getInstructors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { query } = GetInstructorsRequestSchema.parse(req);

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

    updateInstructorStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.body;
            await this._updateInstructorStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.INSTRUCTOR_UPDATED })
        } catch (error) {
            next(error)
        }
    }

    getInstructorProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let id = (req as any).user.id

            const result = await this._getInstructorData.execute(id);
            const response: GetInstructorProfileResponseDTO = {
                success: true,
                message: MESSAGES.INSTRUCTOR_UPDATED,
                instructor: InstructorDTOMapper.toGetInstructorProfile(result)
            };
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }


    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { data } = req.body;
            console.log(data);

            let id = (req as any).user.id

            await this._updateInstructorDataUseCase.execute(id, data);
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED };
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }


    updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { imageURL } = req.body;
            console.log(imageURL);
            
            let id = (req as any).user.id
            console.log('req-user', (req as any).user);

            await this._updateInstructorDataUseCase.execute(id, {profilePic:imageURL});
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED};
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updateExpertise = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { expertise } = req.body;
            console.log(expertise);
            
            let id = (req as any).user.id
            console.log('req-user', (req as any).user);

            await this._updateInstructorDataUseCase.execute(id, {expertise});
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED};
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updateResume = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { resume } = req.body;
            
            let id = (req as any).user.id
            console.log('req-user', (req as any).user);

            await this._updateInstructorDataUseCase.execute(id, {resume});
            const response = { success: true, message: MESSAGES.INSTRUCTOR_UPDATED};
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentPassword, newPassword } = req.body;
            let id = (req as any).user.id
            await this._updateInstructorPasswordUseCase.execute(id, currentPassword, newPassword);
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.INSTRUCTOR_UPDATED })
        } catch (error) {
            next(error)
        }
    }

    applyForVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {   
            console.log('entered contri');
                
            let id = (req as any).user.id
            console.log('req-user', (req as any).user);

            await this._applyForVerificationUseCase.execute(id);
            console.log('fddfd');
            
            const response = { success: true, message: MESSAGES.SEND_VERIFICATION_SUCCESS};
            console.log(response);
            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

}