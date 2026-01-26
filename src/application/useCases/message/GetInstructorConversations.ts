import { ConversationForListing, MessageForListing } from "@application/dtos/message/GetConversations";
import { IGetInstructorConversationsUseCase } from "@application/IUseCases/message/IGetInstructorConversations";
import { ConversationDTOMapper } from "@application/mappers/CoversationMapper";
import { MessageDTOMapper } from "@application/mappers/MessageDTOMapper";
import { Message } from "@domain/entities/Message";
import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { IPresenceService } from "@domain/interfaces/IPresenceService";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";


export class GetInstructorConversationUseCase implements IGetInstructorConversationsUseCase {
    constructor(
        private _conversationRepository: IConversationRepository,
        private _messageRepository: IMessageRepository,
        private _courseRepository: ICourseRepository,
        private _instructorRepository: IInstructorRepository,
        private _learnerRepository: ILearnerRepository,
        private _cloudStorageService: IFileStorageService,
        private _presenceService:IPresenceService
    ) { }

    async execute(input: { instructorId: string; courseId?: string; learnerId?: string; page: number; limit: number; search?: string; selectedCourse?: string; }): Promise<{ conversations: ConversationForListing[]; messages: MessageForListing[]; courses:{id:string; title:string}[],totalPages: number; totalCount: number; }> {
        const { instructorId, courseId, learnerId, page, limit, search, selectedCourse } = input;
        
        const result = await this._conversationRepository.findAllByInstructor({
            instructorId,
            page,
            limit,
            search,
            courseId: selectedCourse
        });
        if(!result){
            throw new AppError("Failed to fetch conversation",STATUS_CODES.BAD_REQUEST)
        }
        let conversations = result.conversations.map(c => ConversationDTOMapper.toListing(c))
        let messages: Message[] = []
        if (courseId && learnerId) {
            const selectedConversation = result.conversations.find(c => c.courseId.id === courseId && c.learnerId.id === learnerId);


            if (selectedConversation) {
                const result = await this._messageRepository.listByConversation(instructorId,selectedConversation.id as string,{limit:20,offset:0})
                messages=result.messages
            } else {
                const courseInfo = await this._courseRepository.findById(courseId);
                if (!courseInfo) {
                    throw new AppError("Failed to fetch course details.")
                }
                const instructorInfo = await this._instructorRepository.findById(courseInfo.instructorId);
                if (!instructorInfo) {
                    throw new AppError("Failed to fetch instructor details.")
                }

                const learnerInfo = await this._learnerRepository.findById(learnerId);
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
                    isOnline:false
                };

                conversations.unshift(tempConversation);

            }

        }
        const learnerIds = conversations
            .map(c => c.learner.id)
            .filter(Boolean);

        const presenceMap = this._presenceService.areOnline(learnerIds);

        conversations = await Promise.all(
            conversations.map(async (conversation) => {
                const instructorProfilePic = conversation.instructor.profilePic ? await this._cloudStorageService.getViewURL(conversation.instructor.profilePic) : null;
                const learnerProfilePic = conversation.learner.profilePic ? await this._cloudStorageService.getViewURL(conversation.learner.profilePic) : null;

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
                    isOnline:presenceMap[conversation.learner.id]??false
                };
            })
        );
        

        const courses= await this._courseRepository.findByInstructor(instructorId);


        const output={
            conversations,
            messages: messages.map(msg => MessageDTOMapper.toListing(msg)),
            totalCount:result.totalCount,
            totalPages:result.totalPages,
            courses:courses.map(c=>{
                return {id:c.id,title:c.title}
            })
        }
        
        return output
    }

}