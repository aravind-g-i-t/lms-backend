import { Conversation, ConversationStatus } from "@domain/entities/Conversation";
import { Course } from "@domain/entities/Course";
import { Instructor } from "@domain/entities/Instructor";
import { Learner } from "@domain/entities/Learner";
import { UserRole } from "@domain/entities/Message";

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


export interface IConversationRepository {
    create(conversation: Partial<Conversation>): Promise<Conversation>;

    findById(id: string): Promise<Conversation | null>;

    findHydratedById(id: string): Promise<HydratedConversation | null>;

    findByCourseAndLearner(
        {courseId,learnerId}:
        {courseId: string,
        learnerId: string}
    ): Promise<Conversation | null>

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

    findByIdAndUpdate(id:string,updates: Partial<Conversation>):Promise<Conversation>;

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
}
