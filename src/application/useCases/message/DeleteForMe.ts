import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { IDeleteMessagesForMeUseCase } from "@application/IUseCases/message/IDeleteForMe";

export class DeleteMessagesForMeUseCase
  implements IDeleteMessagesForMeUseCase {

  constructor(
    private readonly messageRepo: IMessageRepository,
  ) {}

  async execute({
    userId,
    messageIds
  }: {
    userId: string;
    messageIds: string[];
  }): Promise<void> {
    console.log(userId,messageIds);
    

    await this.messageRepo.deleteForUser(messageIds, userId);
  }
}
