import { UserRole } from "@domain/entities/Message";

export interface MarkMessagesReadInput {
    conversationId: string;
    readerRole: UserRole;
}