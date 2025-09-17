import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { GetBusinessesUseCase } from "@application/useCases/business/GetBusinesses";
import { GetBusinessesRequestSchema, GetBusinessesResponseDTO } from "@application/dtos/business/GetBusinesses";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";
import { UpdateBusinessStatusUseCase } from "@application/useCases/business/UpdateBusinessStatus";

export class BusinessController {
    constructor(
        private _getBusinessesUseCase: GetBusinessesUseCase,
        private _updateBusinessStatusUseCase:UpdateBusinessStatusUseCase
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

    updateBusinessStatus=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {id}=req.body;
            console.log(typeof id);
            
            await this._updateBusinessStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.BUSINESS_UPDATED})
        } catch (error) {
            next (error)
        }
    }
}