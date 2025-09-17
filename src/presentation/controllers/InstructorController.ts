import { Request, Response, NextFunction } from "express";
import { GetInstructorsRequestSchema, GetInstructorsResponseDTO } from "@application/dtos/instructor/GetInstructors";
import { GetInstructorsUseCase } from "@application/useCases/instructor/GetInstructors";
import { MESSAGES } from "shared/constants/messages";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { UpdateInstructorStatusUseCase } from "@application/useCases/instructor/UpdateInstructorStatus";

export class InstructorController {
    constructor(
        private _getInstructorsUseCase: GetInstructorsUseCase,
        private _updateInstructorStatusUseCase:UpdateInstructorStatusUseCase

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

    updateInstructorStatus=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {id}=req.body;
            await this._updateInstructorStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.INSTRUCTOR_UPDATED})
        } catch (error) {
            next (error)
        }
    }
}