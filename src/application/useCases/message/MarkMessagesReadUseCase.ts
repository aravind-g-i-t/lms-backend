import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { MarkMessagesReadInput } from "@application/dtos/message/MarkMessagesRead";
import { IMarkMessagesReadUseCase } from "@application/IUseCases/message/IMarkMessagesRead";



export class MarkMessagesReadUseCase implements IMarkMessagesReadUseCase{
    constructor(
        private _messageRepo: IMessageRepository,
        private _conversationRepo: IConversationRepository
    ) {}

    async execute(input: MarkMessagesReadInput): Promise<void> {

        const now = new Date();

        await this._messageRepo.markAsReadForRole(
            input.conversationId,
            input.readerRole,
            now
        );

        await this._conversationRepo.resetUnreadCount(
            input.conversationId,
            input.readerRole
        );
    }
}
