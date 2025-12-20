import { ConversationForListing, MessageForListing } from "@application/dtos/message/GetConversations";
import { SendMessageInput } from "@application/dtos/message/SendMessage";

export interface ISendMessageUseCase {
    execute(input: SendMessageInput): Promise<{ message: MessageForListing, conversation: ConversationForListing }>
}