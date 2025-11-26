import { ICreateEnrollmentUseCase } from "@application/IUseCases/enrollment/ICreateEnrollment";
import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class CreateEnrollmentUseCase implements ICreateEnrollmentUseCase{
    constructor(
        private _enrollmentRepository:IEnrollmentRepository
    ){}

    async execute(input:{learnerId:string,courseId:string, paymentId:string,status:EnrollmentStatus,instructorId:string,instructorName:string,courseTitle:string,thumbnail:string,duration:number}):Promise<Enrollment>{
        const {learnerId,courseId,paymentId,status,instructorId,instructorName,thumbnail,courseTitle,duration} = input;

        console.log(input);
        
        const newEnrollment= await this._enrollmentRepository.create({
            learnerId,
            courseId,
            certificate:null,
            cancelledAt:null,
            completedAt:null,
            enrolledAt:status==="active"?new Date():null,
            paymentId,
            status:status,
            instructorId,
            instructorName,
            thumbnail,
            courseTitle,
            duration
        });
        if(!newEnrollment){
            throw new AppError("Failed to create enrollment record.",STATUS_CODES.BAD_REQUEST)
        }
        return newEnrollment
    }
}