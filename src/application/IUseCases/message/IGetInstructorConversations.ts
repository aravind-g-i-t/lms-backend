import { ConversationForListing, MessageForListing } from "@application/dtos/message/GetConversations";

export interface IGetInstructorConversationsUseCase{
    execute(input:{instructorId: string; courseId?:string,learnerId?:string,page:number,limit:number,search?:string,selectedCourse?:string}):Promise<{conversations:ConversationForListing[],messages:MessageForListing[],courses:{id:string; title:string}[],totalPages:number,totalCount:number}>
};