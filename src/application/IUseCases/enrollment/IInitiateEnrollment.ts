export interface IInitiateEnrollmentUseCase{
    execute(input:{courseId:string,learnerId:string,paymentMethod:"wallet"|"stripe",couponId:string|null}):Promise<{sessionId?:string}>
}