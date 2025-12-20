
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

export const messageRepository= new MessageRepositoryImpl();
export const conversationRepository = new ConversationRepositoryImpl()

export const sendMessageUseCase= new SendMessageUseCase(conversationRepository,messageRepository,s3Service);

export const markMessagesReadUseCase= new MarkMessagesReadUseCase(messageRepository,conversationRepository);



const getConversationsUseCase= new GetLearnerConversationsUseCase(conversationRepository,messageRepository,courseRepository,instructorRepository,learnerRepository,s3Service,presenceService);

const getMessagesUseCase= new GetMessagesUseCase(messageRepository);

const getInstructorConversations= new GetInstructorConversationUseCase(conversationRepository,messageRepository,courseRepository,instructorRepository,learnerRepository,s3Service,presenceService)

export const messageController= new MessageController(
    getConversationsUseCase,
    getMessagesUseCase,
    getInstructorConversations
)