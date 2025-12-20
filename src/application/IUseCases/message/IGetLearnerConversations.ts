import { GetConversationsOutput } from "@application/dtos/message/GetConversations";

export interface IGetLearnerConversationsUseCase{
    execute(input:{courseId?:string,learnerId:string}):Promise<GetConversationsOutput>;
}