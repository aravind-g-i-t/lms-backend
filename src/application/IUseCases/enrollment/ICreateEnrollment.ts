import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";

export interface ICreateEnrollmentUseCase{
    execute(input:{learnerId:string,courseId:string, paymentId:string,status:EnrollmentStatus,instructorId:string,instructorName:string,learnerName:string; courseTitle:string,thumbnail:string,duration:number}):Promise<Enrollment>
}