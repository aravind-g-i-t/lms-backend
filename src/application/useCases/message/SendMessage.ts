
import { HydratedConversation, IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { Conversation, ConversationStatus } from "@domain/entities/Conversation";
import {   UserRole } from "@domain/entities/Message";
import { SendMessageInput } from "@application/dtos/message/SendMessage";
import { ISendMessageUseCase } from "@application/IUseCases/message/ISendMessage";
import { IdGenerator } from "shared/utils/IdGenerator";
import { ConversationForListing, MessageForListing } from "@application/dtos/message/GetConversations";
import { ConversationDTOMapper } from "@application/mappers/CoversationMapper";
import { MessageDTOMapper } from "@application/mappers/MessageDTOMapper";
import { IS3Service } from "@domain/interfaces/IS3Service";



export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        private conversationRepo: IConversationRepository,
        private messageRepo: IMessageRepository,
        private _cloundStorageService:IS3Service
    ) { }

    async execute(input: SendMessageInput): Promise<{message:MessageForListing,conversation:ConversationForListing}> {
        const {courseId,conversationId,senderId,receiverId,senderRole,content,attachments}=input;

        let conversation: Conversation | null = null;


        if (conversationId) {
            conversation = await this.conversationRepo.findById(conversationId);
        }


        if (!conversation) {
            conversation = await this.conversationRepo.findByCourseAndLearner(
                {courseId:courseId as string,
                learnerId:senderRole === UserRole.Learner ? senderId as string : receiverId as string
                }
            );
        }

        if (!conversation) {
            conversation = await this.conversationRepo.create({
                courseId: courseId,
                learnerId: senderRole === UserRole.Learner ? senderId : receiverId,
                instructorId: senderRole === UserRole.Instructor ? senderId : receiverId,
                lastMessageContent: null,
                lastMessageAt: null,
                instructorUnreadCount: 0,
                learnerUnreadCount: 0,
                status: ConversationStatus.Active,
            });
        }
        const attachmentswithId = attachments.map(attachment => {
            return {
                ...attachment,
                id: IdGenerator.generate()
            }
        })


        const savedMessage = await this.messageRepo.create({
            conversationId: conversation.id,
            senderId: senderId,
            senderRole: senderRole,
            content: content,
            attachments: attachmentswithId,
            isRead: false,
            readAt: null,
        });

        await this.conversationRepo.findByIdAndUpdate(
            conversation.id,
            {
                lastMessageContent:savedMessage.content,
                lastMessageAt:savedMessage.createdAt,
            }
        );

        const receiverRole =
            senderRole === UserRole.Learner
                ? UserRole.Instructor
                : UserRole.Learner;

        await this.conversationRepo.incrementUnreadCount(
            conversation.id,
            receiverRole
        );

        const hyderatedConversation= await this.conversationRepo.findHydratedById(conversation.id);
        
        const instructorProfilePic=hyderatedConversation?.instructorId.profilePic? await this._cloundStorageService.getDownloadUrl(hyderatedConversation.instructorId.profilePic):null

        const learnerProfilePic=hyderatedConversation?.learnerId.profilePic? await this._cloundStorageService.getDownloadUrl(hyderatedConversation.learnerId.profilePic):null
        const outputConversation=ConversationDTOMapper.toListing(hyderatedConversation as HydratedConversation)

        return {
            conversation:{...outputConversation,instructor:{...outputConversation.instructor,profilePic:instructorProfilePic}, learner:{...outputConversation.learner,profilePic:learnerProfilePic}},
            message:MessageDTOMapper.toListing(savedMessage)
        };
    }
}
