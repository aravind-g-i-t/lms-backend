import { ConversationRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/ConvesationRepository";
import { CourseRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/CourseRepository";
import { MessageRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/MessageRepository";
import { PaymentRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/PaymentRepository";

export const courseRepository= new CourseRepository();
export const paymentRepository = new PaymentRepositoryImpl();
export const messageRepository= new MessageRepositoryImpl();
export const conversationRepository = new ConversationRepositoryImpl()