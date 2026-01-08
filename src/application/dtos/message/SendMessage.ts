import {  UserRole } from "@domain/entities/Message";

interface AttachmentInput{
    id: string|null;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
}

export interface SendMessageInput {

    courseId?: string;
    conversationId?: string;

    senderId?: string;
    receiverId?: string;

    senderRole: UserRole;
    content: string;
    attachments: AttachmentInput[];
}