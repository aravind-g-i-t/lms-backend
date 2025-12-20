import {  IGetConversationIdUseCase } from "@application/IUseCases/message/IGetConversationId";
import { ConversationStatus } from "@domain/entities/Conversation";
import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class GetConversationIdUseCase implements IGetConversationIdUseCase{
    constructor(
        private _conversationRepo:IConversationRepository
    ){}

    async execute(input: { courseId: string; learnerId: string; instructorId:string}): Promise<string> {
        const {courseId,learnerId,instructorId}=input;
        let conversation= await this._conversationRepo.findByCourseAndLearner({courseId,learnerId});
        if(!conversation){
            conversation=await this._conversationRepo.create({
                courseId,
                instructorId,
                learnerId,
                lastMessageContent:null,
                lastMessageAt:null,
                instructorUnreadCount:0,
                status:ConversationStatus.Active,
            });
        }
        if(!conversation){
            throw new AppError("Failed to get conversation id.",STATUS_CODES.BAD_REQUEST)
        }
        return conversation.id;
    }
}