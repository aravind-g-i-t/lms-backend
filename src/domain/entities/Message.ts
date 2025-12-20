export enum UserRole {
    Instructor = "instructor",
    Learner = "learner"
}

export interface Attachment {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
}


export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderRole: UserRole;

    content: string;
    attachments: Attachment[];

    isRead: boolean;
    readAt: Date|null;

    createdAt: Date;
}