import { Attachment, UserRole } from "@domain/entities/Message";


export interface SendMessageInput {

    courseId?: string;
    conversationId?: string;

    senderId?: string;
    receiverId?: string;

    senderRole: UserRole;
    content: string;
    attachments: Omit<Attachment,"id">[];
}