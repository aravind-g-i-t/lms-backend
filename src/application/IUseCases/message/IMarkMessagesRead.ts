import { MarkMessagesReadInput } from "@application/dtos/message/MarkMessagesRead";

export interface IMarkMessagesReadUseCase{
    execute(input: MarkMessagesReadInput): Promise<void>
}