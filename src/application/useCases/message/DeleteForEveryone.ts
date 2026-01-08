import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IDeleteMessagesForEveryoneUseCase } from "@application/IUseCases/message/IDeleteForEveryone";

const DELETE_WINDOW_MS = 10 * 60 * 1000; 

export class DeleteMessagesForEveryoneUseCase
    implements IDeleteMessagesForEveryoneUseCase {

    constructor(
        private readonly messageRepo: IMessageRepository,
        private readonly fileStorage: IFileStorageService
    ) { }

    async execute({
        userId,
        messageIds
    }: {
        userId: string;
        messageIds: string[];
    }): Promise<void> {

        const messages = await this.messageRepo.findByIds(messageIds);

        for (const msg of messages) {
            if (msg.senderId !== userId) {
                throw new AppError(
                    "You can delete only your own messages",
                    STATUS_CODES.FORBIDDEN
                );
            }

            const isExpired =
                Date.now() - new Date(msg.createdAt).getTime() > DELETE_WINDOW_MS;

            if (isExpired) {
                throw new AppError(
                    "Delete time window expired",
                    STATUS_CODES.FORBIDDEN
                );
            }

            // 🔥 delete attachments from S3
            for (const attachment of msg.attachments) {
                await this.fileStorage.deleteFile(attachment.fileUrl);
            }
        }

        await this.messageRepo.deleteForEveryone(messageIds);

    }
}
