import { Message, UserRole } from "@domain/entities/Message";


export interface IMessageRepository {
  create(message: Partial<Message>): Promise<Message>;

  findById(id: string): Promise<Message | null>;

  listByConversation(
        conversationId: string,
        options: { limit: number; offset: number }
    ): Promise<{messages:Message[];totalCount:number}>

  markAsReadForRole(
    conversationId: string,
    readerRole: UserRole,
    readAt: Date
  ): Promise<void>;
}
