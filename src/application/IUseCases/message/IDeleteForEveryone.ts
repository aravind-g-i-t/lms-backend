export interface IDeleteMessagesForEveryoneUseCase {
  execute(input: {
    userId: string;
    messageIds: string[];
  }): Promise<void>;
}
