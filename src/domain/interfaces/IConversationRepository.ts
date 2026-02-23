import { Conversation, ConversationStatus } from "@domain/entities/Conversation";
import { Course } from "@domain/entities/Course";
import { Instructor } from "@domain/entities/Instructor";
import { Learner } from "@domain/entities/Learner";
import { UserRole } from "@domain/entities/Message";
import { IBaseRepository } from "./IBaseRepository";

export interface HydratedConversation{
    id: string;
    courseId: Course;
    instructorId: Instructor;
    learnerId: Learner;
    lastMessageContent: string|null;
    lastMessageAt: Date|null;
    instructorUnreadCount: number;
    learnerUnreadCount: number;
    status: ConversationStatus; 
    createdAt: Date;
    updatedAt: Date;
}


export interface IConversationRepository extends IBaseRepository<Conversation>  {

    findHydratedById(id: string): Promise<HydratedConversation | null>;


    findAllByLearner(learnerId: string): Promise<HydratedConversation[]>;

    findAllByInstructor({
        instructorId,
        page,
        limit,
        search,
        courseId,
    }: {
        instructorId: string;
        page: number;
        limit: number;
        search?: string;
        courseId?: string;
    }): Promise<{
        conversations: HydratedConversation[];
        totalCount: number;
        totalPages: number;
    }>


    updateLastMessage(
        conversationId: string,
        lastMessageContent: string,
        lastMessageAt: Date
    ): Promise<void>;

    incrementUnreadCount(
        conversationId: string,
        targetRole: UserRole 
    ): Promise<void>;

    resetUnreadCount(
        conversationId: string,
        role: UserRole 
    ): Promise<void>;

    updateStatus(
        conversationId: string,
        status: ConversationStatus
    ): Promise<void>;

    getLearnerUnreadCount(learnerId: string): Promise<number>;

    getInstructorUnreadCount(instructorId: string): Promise<number> 
}
