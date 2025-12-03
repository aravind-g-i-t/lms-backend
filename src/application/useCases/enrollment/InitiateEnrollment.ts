import { ICreateEnrollmentUseCase } from "@application/IUseCases/enrollment/ICreateEnrollment";
import { ICreatePaymentUseCase } from "@application/IUseCases/payment/ICreatePayment";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { PayerType, PaymentReason, PaymentStatus } from "@domain/entities/Payment";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { IPaymentGatewayService } from "@domain/interfaces/IPaymentGatewayService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class InitiateEnrollmentUseCase{
    constructor(
        private _courseRepository:ICourseRepository,
        private _createPaymentUseCase:ICreatePaymentUseCase,
        private _createEnrollmentUseCase:ICreateEnrollmentUseCase,
        private _paymentGatewayService:IPaymentGatewayService,
        private _instructorRepository:IInstructorRepository
    ){}

async execute(input:{courseId:string,learnerId:string,paymentMethod:"wallet"|"stripe",couponId:string|null}):Promise<{sessionId?:string}>{

        const {courseId,paymentMethod,learnerId}= input;
        

        const course = await this._courseRepository.findById(courseId);
        if(!course){
            throw new AppError("Course not found.",STATUS_CODES.NOT_FOUND)
        }

        const instructor= await this._instructorRepository.findById(course.instructorId);

        if(!instructor){
            throw new AppError("Instructor not found.",STATUS_CODES.NOT_FOUND)
        }

        const payment = await this._createPaymentUseCase.execute({
            paidAmount:course.price,
            grossAmount:course.price,
            discount:0,
            payerId:learnerId,
            payerType:PayerType.Learner,
            coupon:null,
            status:PaymentStatus.Pending,
            transactionId:null,
            method:paymentMethod,
            reason:PaymentReason.CourseEnrollment
        });
        console.log("payment",payment);
        

        const enrollment = await this._createEnrollmentUseCase.execute({
            learnerId,
            courseId,
            paymentId:payment.id,
            status:EnrollmentStatus.Pending,
            duration:course.duration,
            thumbnail:course.thumbnail as string,
            courseTitle:course.title,
            instructorId:instructor.id,
            instructorName:instructor.name
        });

        console.log("enrollment",enrollment);

        const sessionId = await this._paymentGatewayService.createCheckoutSession({
            amount:course.price,
            paymentId:payment.id,
            referenceId:enrollment.id,
            paymentReason:payment.reason
        });

        return {sessionId};
    }
}