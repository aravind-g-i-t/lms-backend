export interface IGetConversationIdUseCase{
    execute(input:{courseId:string;learnerId:string;instructorId:string}):Promise<string>
}