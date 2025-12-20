export interface Conversation {
    id: string;
    courseId: string;
    instructorId: string;
    learnerId: string;
    
    lastMessageContent: string|null;
    lastMessageAt: Date|null;
    
    instructorUnreadCount: number;
    learnerUnreadCount: number;
    
    status: ConversationStatus; 
    
    createdAt: Date;
    updatedAt: Date;
}

export enum ConversationStatus {
    Active = "active",
    Archived = "archived"
}