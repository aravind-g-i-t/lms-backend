import { MessageForListing } from "@application/dtos/message/GetConversations";
import { Message } from "@domain/entities/Message";

export class MessageDTOMapper{
    static toListing(input:Message):MessageForListing{
        return {
             id: input.id,
              senderId: input.senderId,
              content: input.content,
              attachments: input.attachments,
              createdAt: input.createdAt,
              isRead: input.isRead,
              readAt: input.readAt,
        }
    }
}