import { Response, NextFunction } from "express";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { GetBusinessesRequestSchema, GetBusinessesResponseDTO } from "@application/dtos/business/GetBusinesses";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";
import { IGetBusinessesUseCase } from "@application/IUseCases/business/IGetBusinesses";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { GetBusinessProfileResponseDTO } from "@application/dtos/business/GetProfile";
import { IGetBusinessDataUseCase } from "@application/IUseCases/business/IGetBusinessData";
import { IUpdateBusinessDataUseCase } from "@application/IUseCases/business/IUpdateBusinessData";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { AuthenticatedRequest } from "@presentation/middlewares/createAuthMiddleware";

import { AppError } from "shared/errors/AppError";
import { IApplyForBusinessVeficationUseCase } from "@application/IUseCases/business/IBusinessApplyForVerification";
import { IUpdateBusinessVerificationStatusUseCase } from "@application/IUseCases/business/IUpdateVerificationStatus";

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
            const { query } = GetBusinessesRequestSchema.parse(req);

            const { page, search, status, limit, verificationStatus } = query
            const result = await this._getBusinessesUseCase.execute({ page,search,status,limit,verificationStatus });
            console.log(result);



            const response:GetBusinessesResponseDTO = {
                success: true,
                message: MESSAGES.BUSINESS_FETCHED,
                businesses: result.businesses.map(business => BusinessDTOMapper.toGetBusinessesDTO(business)),
                totalCount: result.totalCount,
                totalPages: result.totalPages
            }
            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

    updateBusinessStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.body.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.BUSINESS_UPDATED })
        } catch (error) {
            next(error)
        }
    }

    getBusinessProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const result = await this._getBusinessDataUseCase.execute(id);
            const response: GetBusinessProfileResponseDTO = {
                success: true,
                message: MESSAGES.BUSINESS_UPDATED,
                business: BusinessDTOMapper.toGetBusinessProfileDTO(result)
            };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const { name,businessDomain,website,location } = req.body;
            console.log("req.body",req.body);
            

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            await this._updateBusinessDataUseCase.execute(id, {name,businessDomain,website,location});
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updateProfileImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const { imageURL } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessDataUseCase.execute(id, { profilePic: imageURL });
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updateLicense = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const { license } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessDataUseCase.execute(id, { license });
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { currentPassword, newPassword } = req.body;

            const id = req.user?.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            await this._updateBusinessPasswordUseCase.execute(id, currentPassword, newPassword);
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.BUSINESS_UPDATED })
        } catch (error) {
            next(error)
        }
    }


    applyForVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const id = req.user?.id
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

    getBusinessDataForAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            if (!id) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const result = await this._getBusinessDataUseCase.execute(id);
            const response: GetBusinessProfileResponseDTO = {
                success: true,
                message: MESSAGES.BUSINESS_UPDATED,
                business: BusinessDTOMapper.toGetBusinessProfileDTO(result)
            };
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }


    updateVerificationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { id, status, remarks } = req.body;
            await this._updateVerificationStatusUseCase.execute({ id, status, remarks });

            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED };
            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

}