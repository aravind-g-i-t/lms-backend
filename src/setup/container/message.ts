
import { GetLearnerConversationsUseCase } from "@application/useCases/message/GetLearnerConversations";
import { MarkMessagesReadUseCase } from "@application/useCases/message/MarkMessagesReadUseCase";
import { SendMessageUseCase } from "@application/useCases/message/SendMessage";
import { ConversationRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/ConvesationRepository";
import { MessageRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/MessageRepository";
import { MessageController } from "@presentation/http/controllers/MessageController";
import { courseRepository } from "./course";
import { instructorRepository } from "./instructor/instructorRepository";
import { s3Service } from "./shared/s3Controller";
import { learnerRepository } from "./learner/learnerRepository";
import { GetMessagesUseCase } from "@application/useCases/message/GetMessages";
import { GetInstructorConversationUseCase } from "@application/useCases/message/GetInstructorConversations";
import { presenceService } from "./presence";
import { getVideoCallTokenUseCase } from "./videoCall";
import { DeleteMessagesForMeUseCase } from "@application/useCases/message/DeleteForMe";
import { DeleteMessagesForEveryoneUseCase } from "@application/useCases/message/DeleteForEveryone";
import { GetUnreadMessagesCountUseCase } from "@application/useCases/message/GetUnreadCount";

export const messageRepository= new MessageRepositoryImpl();
export const conversationRepository = new ConversationRepositoryImpl()

export const sendMessageUseCase= new SendMessageUseCase(conversationRepository,messageRepository,s3Service);

export const markMessagesReadUseCase= new MarkMessagesReadUseCase(messageRepository,conversationRepository);



const getConversationsUseCase= new GetLearnerConversationsUseCase(conversationRepository,messageRepository,courseRepository,instructorRepository,learnerRepository,s3Service,presenceService);

const getMessagesUseCase= new GetMessagesUseCase(messageRepository,s3Service);

const getInstructorConversations= new GetInstructorConversationUseCase(conversationRepository,messageRepository,courseRepository,instructorRepository,learnerRepository,s3Service,presenceService);

const deleteForMeUseCase= new DeleteMessagesForMeUseCase(messageRepository);

const deleteForEveryoneUseCase= new DeleteMessagesForEveryoneUseCase(messageRepository,s3Service)

export const getUnreadMessagesCountUseCase= new GetUnreadMessagesCountUseCase(conversationRepository)

export const messageController= new MessageController(
    getConversationsUseCase,
    getMessagesUseCase,
    getInstructorConversations,
    getVideoCallTokenUseCase,
    deleteForMeUseCase,
    deleteForEveryoneUseCase
)