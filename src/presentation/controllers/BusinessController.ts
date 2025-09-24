import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { GetBusinessesUseCase } from "@application/useCases/business/GetBusinesses";
import { GetBusinessesRequestSchema, GetBusinessesResponseDTO } from "@application/dtos/business/GetBusinesses";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";
import { UpdateBusinessStatusUseCase } from "@application/useCases/business/UpdateBusinessStatus";
import { IGetBusinessesUseCase } from "@application/IUseCases/business/IGetBusinesses";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { GetBusinessProfileResponseDTO } from "@application/dtos/business/GetProfile";
import { IGetBusinessDataUseCase } from "@application/IUseCases/business/IGetBusinessData";
import { IUpdateBusinessDataUseCase } from "@application/IUseCases/business/IUpdateBusinessData";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";

export class BusinessController {
    constructor(
        private _getBusinessesUseCase: IGetBusinessesUseCase,
        private _updateBusinessStatusUseCase: IUpdateUserStatusUseCase,
        private _getBusinessDataUseCase: IGetBusinessDataUseCase,
        private _updateBusinessDataUseCase:IUpdateBusinessDataUseCase,
        private _updateBusinessPasswordUseCase:IUpdateUserPassword
    ) { }

    getBusinesses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { query } = GetBusinessesRequestSchema.parse(req);

            const { page, search, status, limit } = query
            const result = await this._getBusinessesUseCase.execute({
                page,
                search,
                status,
                limit
            });

            const response = {
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

    updateBusinessStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.body;
            console.log(typeof id);

            await this._updateBusinessStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.BUSINESS_UPDATED })
        } catch (error) {
            next(error)
        }
    }

    getBusinessProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let id = (req as any).user.id
            console.log('req-user', (req as any).user);

            const result = await this._getBusinessDataUseCase.execute(id);
            const response: GetBusinessProfileResponseDTO = {
                success: true,
                message: MESSAGES.BUSINESS_UPDATED,
                business: BusinessDTOMapper.toGetBusinessProfileDTO(result)
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

            await this._updateBusinessDataUseCase.execute(id, data);
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED};
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

            await this._updateBusinessDataUseCase.execute(id, {profilePic:imageURL});
            const response = { success: true, message: MESSAGES.BUSINESS_UPDATED};
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    updatePassword=async(req:Request,res:Response,next:NextFunction)=>{
            try {
                const {currentPassword,newPassword}=req.body;

                let id = (req as any).user.id
                await this._updateBusinessPasswordUseCase.execute(id,currentPassword,newPassword);
                res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.BUSINESS_UPDATED})
            } catch (error) {
                next (error)
            }
        }
}