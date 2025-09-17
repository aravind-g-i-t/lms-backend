
import { NextFunction, Request, Response } from "express";
import { GetLearnersUseCase } from "@application/useCases/learner/GetLearners";
import { GetLearnersRequestSchema, GetLearnersResponseDTO } from "@application/dtos/learner/GetLearners";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { LearnerDTOMapper } from "@application/mappers/LearnerMapper";
import { UpdateLearnerStatusUseCase } from "@application/useCases/learner/UpdateLearnerStatus";
import { th } from "zod/v4/locales/index.cjs";
import { UpdateLearnerProfileUseCase } from "@application/useCases/learner/UpdateProfile";
import { UpdateLearnerProfileResponseDTO } from "@application/dtos/learner/UpdateProfile";
import { UpdateLearnerPasswordUseCase } from "@application/useCases/learner/UpdatePassword";

export class LearnerController {
    constructor(
        private _getLearnersUseCase: GetLearnersUseCase,
        private _updateLearnerStatusUseCase:UpdateLearnerStatusUseCase,
        private _updateProfile:UpdateLearnerProfileUseCase,
        private _updatePassword:UpdateLearnerPasswordUseCase
    ) { }

    getLearners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { query } = GetLearnersRequestSchema.parse(req);

            const { page, search, status, limit } = query
            const result = await this._getLearnersUseCase.execute({
                page,
                search,
                status,
                limit
            });

            const response: GetLearnersResponseDTO = {
                success: true,
                message: MESSAGES.LEARNERS_FETCHED,
                learners: result.learners.map(learner => LearnerDTOMapper.toGetLearnersDTO(learner)),
                totalCount: result.totalCount,
                totalPages: result.totalPages
            }

            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            next(error)
        }
    }


    updateLearnerStatus=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {id}=req.body;
            await this._updateLearnerStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.LEARNER_UPDATED})
        } catch (error) {
            next (error)
        }
    }

    updateProfile=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {id,data}=req.body;
            const result=await this._updateProfile.execute(id,data);
            const response:UpdateLearnerProfileResponseDTO={success:true,message:MESSAGES.LEARNER_UPDATED,name:result.name,imageURL:result.profilePic};
            console.log(response);
            
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next (error)
        }
    }

    updatePassword=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {id,currentPassword,newPassword}=req.body;
            console.log(typeof id,typeof currentPassword,typeof newPassword);
            
            await this._updatePassword.execute(id,currentPassword,newPassword);
            res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.LEARNER_UPDATED})
        } catch (error) {
            next (error)
        }
    }
}