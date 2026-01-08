export interface IDeleteMessagesForMeUseCase {
  execute(input: {
    userId: string;
    messageIds: string[];
  }): Promise<void>;
}
