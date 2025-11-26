export interface IInitiateEnrollmentUseCase{
    execute(input:{courseId:string,learnerId:string,paymentMethod:"wallet"|"stripe"}):Promise<{sessionId?:string}>
}