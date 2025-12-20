import { MessageForListing } from "@application/dtos/message/GetConversations";
import { IGetMessagesUseCase } from "@application/IUseCases/message/IGetMessages";
import { MessageDTOMapper } from "@application/mappers/MessageDTOMapper";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";


export class GetMessagesUseCase implements IGetMessagesUseCase{
    constructor(
        private _messageRepo: IMessageRepository
    ) { }

    async execute(input: { conversationId: string, limit?: number, offset?: number }): Promise<{messages:MessageForListing[],hasMore:boolean}> {
        console.log("input",input);
        
        const { conversationId } = input;

        const limit= input.limit || 20
        const offset= input.offset || 0

        const {messages,totalCount} = await this._messageRepo.listByConversation(conversationId, { offset, limit });
        console.log(messages);

        const hasMore=messages.length+offset<totalCount;
        
        return {
            messages:messages.map(m => MessageDTOMapper.toListing(m)).reverse(),
            hasMore
        }
    }
}