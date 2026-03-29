import { ICreateEnrollmentUseCase } from "@application/IUseCases/enrollment/ICreateEnrollment";
import { IInitiateEnrollmentUseCase } from "@application/IUseCases/enrollment/IInitiateEnrollment";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { EarningStatus } from "@domain/entities/InstructorEarning";
import { PayerType, PaymentMethod, PaymentReason, PaymentStatus } from "@domain/entities/Payment";
import { TransactionReason, TransactionType } from "@domain/entities/WalletTransaction";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IPaymentGatewayService } from "@domain/interfaces/IPaymentGatewayService";
import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { IWalletTransactionRepository } from "@domain/interfaces/IWalletTxnRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { IdGenerator } from "shared/utils/IdGenerator";

const PLATFORM_CUT = Number(process.env.PLATFORM_CUT) || 30;

export class InitiateEnrollmentUseCase implements IInitiateEnrollmentUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _paymentRepository: IPaymentRepository,
        private _createEnrollmentUseCase: ICreateEnrollmentUseCase,
        private _paymentGatewayService: IPaymentGatewayService,
        private _instructorRepository: IInstructorRepository,
        private _couponRepository: ICouponRepository,
        private _learnerRepository: ILearnerRepository,
        private _enrollmentRepository: IEnrollmentRepository,
        private _walletRepository: IWalletRepository,
        private _walletTransactionRepository: IWalletTransactionRepository,
        private _instructorEarningsRepository:IInstructorEarningsRepository,
        private _instructorWalletRepository: IInstructorWalletRepository,
        private _learnerProgress: ILearnerProgressRepository
    ) { }

    async execute(input: { courseId: string, learnerId: string, paymentMethod: "wallet" | "stripe", couponId: string | null }): Promise<{ sessionId?: string }> {

        const { courseId, paymentMethod, learnerId, couponId } = input;

        const activeEnrollment = await this._enrollmentRepository.findOne({
            learnerId,
            courseId,
            status: EnrollmentStatus.Active
        });

        if (activeEnrollment) {
            throw new AppError("You have alread purchased the course", STATUS_CODES.BAD_REQUEST)
        }

        const activeSessionExists = await this._enrollmentRepository.findOne({
            learnerId,
            courseId,
            status: EnrollmentStatus.Pending
        });

        if (activeSessionExists) {
            throw new AppError("Payment already in progress. Please complete the existing checkout.", STATUS_CODES.BAD_REQUEST)
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
        let paidAmount = course.price;
        let discount = 0;
        const coupon = couponId ? await this._couponRepository.findById(couponId) : null;
        if (couponId && !coupon) {
            throw new AppError(MESSAGES.COUPON_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        }

        if (coupon) {
            const couponStatus = await this._couponRepository.isApplicable({ couponId: coupon.id, amount: course.price });
            if (!couponStatus.applicable) {
                throw new AppError(couponStatus.reason as string, STATUS_CODES.BAD_REQUEST);
            }
            const couponApplied = await this._couponRepository.applyCoupon({ couponId: coupon.id, amount: course.price });
            paidAmount = couponApplied.finalAmount;
            discount = couponApplied.discount;
        }

        if (paymentMethod === "wallet") {
            const wallet = await this._walletRepository.findOne({ learnerId });
            if (!wallet || wallet.balance < paidAmount) {
                throw new AppError(MESSAGES.INSUFFICIENT_WALLET_BALANCE, STATUS_CODES.BAD_REQUEST)
            }

            await this._walletRepository.updateBalance(learnerId, 0 - paidAmount);


            
            const payment = await this._paymentRepository.create({
                paidAmount,
                grossAmount: course.price,
                discount,
                payerId: learnerId,
                payerType: PayerType.Learner,
                coupon: couponId,
                status: PaymentStatus.Success,
                transactionId: IdGenerator.generate(),
                method: PaymentMethod.Wallet,
                reason: PaymentReason.CourseEnrollment,
                paidAt: new Date(),
                enrollmentId: null,
                refundedAt: null
            });

            if (!payment) {
                throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
            
            const enrollment = await this._createEnrollmentUseCase.execute({
                learnerId,
                courseId,
                paymentId: payment.id,
                status: EnrollmentStatus.Active,
                duration: course.duration,
                thumbnail: course.thumbnail as string,
                courseTitle: course.title,
                instructorId: instructor.id,
                instructorName: instructor.name,
                learnerName: learner.name
            });
            if (!enrollment) {
                throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
            
            await this._walletTransactionRepository.create({
                learnerId,
                walletId: wallet.id,
                amount: paidAmount,
                type: TransactionType.Debit,
                reason: TransactionReason.CoursePurchase,
                enrollmentId: enrollment.id
            });


            const paymentUpdated= await this._paymentRepository.updateById(payment.id,
                {enrollmentId:enrollment.id}
            )

            if(!paymentUpdated){
                throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const instructorShare = payment.grossAmount * (100 - PLATFORM_CUT) / 100;
            const releaseAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            const instructorEarnings = await this._instructorEarningsRepository.create({
                instructorId: enrollment.instructorId,
                courseId: enrollment.courseId,
                learnerId: enrollment.learnerId,
                amount: instructorShare,
                releaseAt,
                cancelledAt: null,
                status: EarningStatus.Pending,
                enrollmentId: enrollment.id
            });

            if (!instructorEarnings) {
                throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR);
            }

            const instructorWallet = await this._instructorWalletRepository.updateBalance({
                instructorId: enrollment.instructorId,
                pendingBalance: instructorShare
            });


            if(!instructorWallet){
                throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            const courseUpdated = await this._courseRepository.incrementEnrollment(enrollment.courseId);
            

            if (!courseUpdated) {
                throw new AppError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND)
            }

            let learnerProgress = await this._learnerProgress.findOne({ learnerId: enrollment.learnerId, courseId: enrollment.courseId });

            if (!learnerProgress) {
                learnerProgress = await this._learnerProgress.create({
                    learnerId: enrollment.learnerId,
                    courseId: enrollment.courseId,
                    completedChapters: [],
                    progressPercentage: 0,
                    currentChapterId: null,
                    totalChapters: course.totalChapters,
                    lastAccessedAt: null,
                });
            }            

            if (!learnerProgress) {
                throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            if (payment.coupon) {
                await this._couponRepository.incrementUsage(payment.coupon)
            }

            return {};


        } else {

            const payment = await this._paymentRepository.create({
                paidAmount,
                grossAmount: course.price,
                discount,
                payerId: learnerId,
                payerType: PayerType.Learner,
                coupon: couponId,
                status: PaymentStatus.Pending,
                transactionId: null,
                method: PaymentMethod.Stripe,
                reason: PaymentReason.CourseEnrollment,
                paidAt: null,
                enrollmentId: null,
                refundedAt: null
            });

            if (!payment) {
                throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR);
            }


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
                learnerName: learner.name
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
}
