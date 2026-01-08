import { MessageForListing } from "@application/dtos/message/GetConversations";

export interface IGetMessagesUseCase{
    execute(input: {  userId:string; conversationId: string, limit?: number, offset?: number }): Promise<{messages:MessageForListing[],hasMore:boolean}>
}