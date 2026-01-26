import { MessageForListing } from "@application/dtos/message/GetConversations";
import { IGetMessagesUseCase } from "@application/IUseCases/message/IGetMessages";
import { MessageDTOMapper } from "@application/mappers/MessageDTOMapper";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";


export class GetMessagesUseCase implements IGetMessagesUseCase {
    constructor(
        private _messageRepo: IMessageRepository,
        private _fileStorageService: IFileStorageService
    ) { }

    async execute(input: { userId:string; conversationId: string, limit?: number, offset?: number }): Promise<{ messages: MessageForListing[], hasMore: boolean }> {

        const { conversationId ,userId} = input;

        const limit = input.limit || 20
        const offset = input.offset || 0

        const { messages, totalCount } = await this._messageRepo.listByConversation(userId,conversationId, { offset, limit });

        const mappedMessages = await Promise.all(
            messages.map(async (message) => {
                const attachments = await Promise.all(
                    message.attachments.map(async (attachment) => {
                        const fileUrl =
                            await this._fileStorageService.getViewURL(
                                attachment.fileUrl
                            );

                        return {
                            ...attachment,
                            fileUrl
                        };
                    })
                );

                return {
                    ...message,
                    attachments
                };
            })
        );


        const hasMore = messages.length + offset < totalCount;

        return {
            messages: mappedMessages.map(m => MessageDTOMapper.toListing(m)).reverse(),
            hasMore
        }
    }
}