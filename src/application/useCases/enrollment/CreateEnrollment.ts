import { ICreateEnrollmentUseCase } from "@application/IUseCases/enrollment/ICreateEnrollment";
import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class CreateEnrollmentUseCase implements ICreateEnrollmentUseCase{
    constructor(
        private _enrollmentRepository:IEnrollmentRepository
    ){}

    async execute(input:{learnerId:string,courseId:string, paymentId:string,status:EnrollmentStatus,instructorId:string,instructorName:string, learnerName:string; courseTitle:string,thumbnail:string,duration:number}):Promise<Enrollment>{
        const {learnerId,courseId,paymentId,status,instructorId,instructorName,thumbnail,courseTitle,duration,learnerName} = input;

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
            learnerName,
            duration
        });
        if(!newEnrollment){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        return newEnrollment
    }
}