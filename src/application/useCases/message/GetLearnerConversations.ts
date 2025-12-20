import { GetConversationsOutput } from "@application/dtos/message/GetConversations";
import { IGetLearnerConversationsUseCase } from "@application/IUseCases/message/IGetLearnerConversations";
import { ConversationDTOMapper } from "@application/mappers/CoversationMapper";
import { MessageDTOMapper } from "@application/mappers/MessageDTOMapper";
import { Message } from "@domain/entities/Message";
import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { IPresenceService } from "@domain/interfaces/IPresenceService";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { AppError } from "shared/errors/AppError";

export class GetLearnerConversationsUseCase implements IGetLearnerConversationsUseCase {
    constructor(
        private _conversationRepo: IConversationRepository,
        private _messageRepo: IMessageRepository,
        private _courseRepo: ICourseRepository,
        private _instructorRepo: IInstructorRepository,
        private _learnerRepo: ILearnerRepository,
        private _cloudStorageService: IS3Service,
        private _presenceService: IPresenceService
    ) { }

    async execute(input: { courseId?: string; learnerId: string; }): Promise<GetConversationsOutput> {
        const { courseId, learnerId } = input;
        console.log("input", input);

        const data = await this._conversationRepo.findAllByLearner(learnerId);
        console.log("conversations", data);

        let conversations = data.map(conv => ConversationDTOMapper.toListing(conv))
        let selectedMessages: Message[] = []
        if (courseId) {
            const selectedConversation = conversations.find(
                con => con.course.id === courseId
            ) || null;
            console.log("selectedConversation", selectedConversation);


            if (selectedConversation) {
                const result = await this._messageRepo.listByConversation(selectedConversation.id as string, { limit: 20, offset: 0 });
                selectedMessages = result.messages
            } else {
                const courseInfo = await this._courseRepo.findById(courseId);
                if (!courseInfo) {
                    throw new AppError("Failed to fetch course details.")
                }
                const instructorInfo = await this._instructorRepo.findById(courseInfo.instructorId);
                if (!instructorInfo) {
                    throw new AppError("Failed to fetch instructor details.")
                }

                const learnerInfo = await this._learnerRepo.findById(learnerId);
                if (!learnerInfo) {
                    throw new AppError("Failed to fetch learner details.")
                }

                const tempConversation = {
                    id: null,
                    course: {
                        id: courseInfo.id,
                        name: courseInfo.title,
                    },
                    instructor: {
                        id: instructorInfo.id,
                        name: instructorInfo.name,
                        profilePic: instructorInfo.profilePic,
                    },
                    learner: {
                        id: learnerInfo.id,
                        name: learnerInfo.name,
                        profilePic: learnerInfo.profilePic
                    },
                    lastMessageContent: null,
                    lastMessageAt: null,
                    learnerUnreadCount: 0,
                    instructorUnreadCount: 0,
                    isOnline: false
                };
                console.log("tempConversation", tempConversation);


                conversations.unshift(tempConversation);
                console.log("conversations", conversations);
            }

        }
        const instructorIds = conversations
            .map(c => c.instructor.id)
            .filter(Boolean);

        const presenceMap = this._presenceService.areOnline(instructorIds);


        conversations = await Promise.all(
            conversations.map(async (conversation) => {
                const instructorProfilePic = conversation.instructor.profilePic ? await this._cloudStorageService.getDownloadUrl(conversation.instructor.profilePic) : null;
                const learnerProfilePic = conversation.learner.profilePic ? await this._cloudStorageService.getDownloadUrl(conversation.learner.profilePic) : null;

                

                return {
                    ...conversation,
                    instructor: {
                        ...conversation.instructor,
                        profilePic: instructorProfilePic
                    },
                    learner: {
                        ...conversation.learner,
                        profilePic: learnerProfilePic
                    },
                    isOnline:presenceMap[conversation.instructor.id]??false
                };
            })
        );

        return { conversations, messages: selectedMessages.map(msg => MessageDTOMapper.toListing(msg)) }
    }

}