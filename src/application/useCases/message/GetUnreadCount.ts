import { IConversationRepository } from "@domain/interfaces/IConversationRepository";

export class GetUnreadMessagesCountUseCase{
    constructor(
        private _conversationRepository:IConversationRepository
    ){}

    async execute(input:{role:string,id:string}):Promise<number>{
        const {role,id}=input
        let count;
        if(role==="learner"){
            count=await this._conversationRepository.getLearnerUnreadCount(id);
        }else{
            count= await this._conversationRepository.getInstructorUnreadCount(id)
        }
        return count;
    }
}

