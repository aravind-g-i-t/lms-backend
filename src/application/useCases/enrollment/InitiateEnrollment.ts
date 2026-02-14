import { ICreateEnrollmentUseCase } from "@application/IUseCases/enrollment/ICreateEnrollment";
import { IInitiateEnrollmentUseCase } from "@application/IUseCases/enrollment/IInitiateEnrollment";
import { ICreatePaymentUseCase } from "@application/IUseCases/payment/ICreatePayment";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { PayerType, PaymentReason, PaymentStatus } from "@domain/entities/Payment";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IPaymentGatewayService } from "@domain/interfaces/IPaymentGatewayService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class InitiateEnrollmentUseCase implements IInitiateEnrollmentUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _createPaymentUseCase: ICreatePaymentUseCase,
        private _createEnrollmentUseCase: ICreateEnrollmentUseCase,
        private _paymentGatewayService: IPaymentGatewayService,
        private _instructorRepository: IInstructorRepository,
        private _couponRepository: ICouponRepository,
        private _learnerRepository:ILearnerRepository,
        private _enrollmentRepository:IEnrollmentRepository
    ) { }

    async execute(input: { courseId: string, learnerId: string, paymentMethod: "wallet" | "stripe", couponId: string | null }): Promise<{ sessionId?: string }> {        

        const { courseId, paymentMethod, learnerId, couponId } = input;

        const activeEnrollment= await this._enrollmentRepository.findOne({
            learnerId,
            courseId,
            status:EnrollmentStatus.Active
        });
        if(activeEnrollment){
            throw new AppError("You have alread purchased the course",STATUS_CODES.BAD_REQUEST)
        }
        
        const activeSessionExists= await this._enrollmentRepository.findOne({
            learnerId,
            courseId,
            status:EnrollmentStatus.Pending
        });
        
        if(activeSessionExists){
            throw new AppError("Payment already in progress. Please complete the existing checkout.",STATUS_CODES.BAD_REQUEST)
        }
        
        const course = await this._courseRepository.findById(courseId);
        if (!course) {
            throw new AppError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        }
        
        const instructor = await this._instructorRepository.findById(course.instructorId);
        
        if (!instructor) {
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        }
        const learner = await this._learnerRepository.findById(learnerId);

        if (!learner) {
            throw new AppError(MESSAGES.LEARNER_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        }
        let paidAmount=course.price;
        let discount = 0;
        const coupon=couponId?await this._couponRepository.findById(couponId):null;
        if (couponId && !coupon) {
            throw new AppError(MESSAGES.COUPON_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        }

        if(coupon){
            const couponStatus= await this._couponRepository.isApplicable({couponId:coupon.id,amount:course.price});
            if(!couponStatus.applicable){
                throw new AppError (couponStatus.reason as string,STATUS_CODES.BAD_REQUEST);
            }
            const couponApplied = await this._couponRepository.applyCoupon({couponId:coupon.id,amount:course.price});
            paidAmount=couponApplied.finalAmount;
            discount=couponApplied.discount;
        }

        const payment = await this._createPaymentUseCase.execute({
            paidAmount,
            grossAmount: course.price,
            discount,
            payerId: learnerId,
            payerType: PayerType.Learner,
            coupon: couponId,
            status: PaymentStatus.Pending,
            transactionId: null,
            method: paymentMethod,
            reason: PaymentReason.CourseEnrollment
        });


        const enrollment = await this._createEnrollmentUseCase.execute({
            learnerId,
            courseId,
            paymentId: payment.id,
            status: EnrollmentStatus.Pending,
            duration: course.duration,
            thumbnail: course.thumbnail as string,
            courseTitle: course.title,
            instructorId: instructor.id,
            instructorName: instructor.name,
            learnerName:learner.name
        });

        const sessionId = await this._paymentGatewayService.createCheckoutSession({
            amount: paidAmount,
            paymentId: payment.id,
            referenceId: enrollment.id,
            paymentReason: payment.reason
        });

        return { sessionId };
    }
}