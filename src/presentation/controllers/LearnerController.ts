
import { NextFunction, Request, Response } from "express";
import { GetLearnersRequestSchema, GetLearnersResponseDTO } from "@application/dtos/learner/GetLearners";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { LearnerDTOMapper } from "@application/mappers/LearnerMapper";
import { UpdateLearnerProfileResponseDTO } from "@application/dtos/learner/UpdateProfile";
import { IGetLearnerDataUseCase } from "@application/IUseCases/learner/IGetLearnerData";
import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IUpdateLearnerDataUseCase } from "@application/IUseCases/learner/IUpdateLearnerData";
import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IGetLearnersUseCase } from "@application/IUseCases/learner/IGetLearners";
import { GetLearnerProfileResponseDTO } from "@application/dtos/learner/GetProfile";

export class LearnerController {
    constructor(
        private _getLearnersUseCase: IGetLearnersUseCase,
        private _updateLearnerStatusUseCase:IUpdateUserStatusUseCase,
        private _updateLearnerDataUseCase:IUpdateLearnerDataUseCase,
        private _updatePassword:IUpdateUserPassword,
        private _getLearnerData:IGetLearnerDataUseCase,
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
            let id=req.body.id
            await this._updateLearnerStatusUseCase.execute(id);
            res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.LEARNER_UPDATED})
        } catch (error) {
            next (error)
        }
    }

    updateProfile=async(req:Request,res:Response,next:NextFunction)=>{
        try {

            const {data}=req.body;
            let id=(req as any).user.id
            
            const result=await this._updateLearnerDataUseCase.execute(id,data);
            const response={success:true,message:MESSAGES.LEARNER_UPDATED};
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next (error)
        }
    }

    updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
            try {
    
                const { imageURL } = req.body;
                console.log(imageURL);
                
                let id = (req as any).user.id
                console.log('req-user', (req as any).user);
    
                await this._updateLearnerDataUseCase.execute(id, {profilePic:imageURL});
                const response = { success: true, message: MESSAGES.LEARNER_UPDATED};
                console.log(response);
                res.status(STATUS_CODES.OK).json(response)
            } catch (error) {
                next(error)
            }
        }

    updatePassword=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            let id=(req as any).user.id
            const {currentPassword,newPassword}=req.body;
            
            await this._updatePassword.execute(id,currentPassword,newPassword);
            res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.LEARNER_UPDATED})
        } catch (error) {
            next (error)
        }
    }

    getLearnerProfile=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            let id=(req as any).user.id
            console.log('req-user',(req as any).user);
            
            const result=await this._getLearnerData.execute(id);
            const response:GetLearnerProfileResponseDTO={
                success:true,
                message:MESSAGES.LEARNER_UPDATED,
                learner:LearnerDTOMapper.toProfileDTO(result)
            };
            console.log(response);
            res.status(STATUS_CODES.OK).json(response)
        } catch (error) {
            next (error)
        }
    }
}