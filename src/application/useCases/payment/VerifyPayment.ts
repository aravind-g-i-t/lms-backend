import { IVerifyPaymentUseCase } from "@application/IUseCases/payment/IVerifyPayment";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { EarningStatus } from "@domain/entities/InstructorEarning";
import { PaymentStatus } from "@domain/entities/Payment";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
// import { IFavouriteRepository } from "@domain/interfaces/IFavouriteRepository";
import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IPaymentGatewayService } from "@domain/interfaces/IPaymentGatewayService";
import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

const PLATFORM_CUT = Number(process.env.PLATFORM_CUT) || 30;


export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private paymentRepo: IPaymentRepository,
        private enrollmentRepo: IEnrollmentRepository,
        private paymentGateway: IPaymentGatewayService,
        private _instructorWalletReposotory: IInstructorWalletRepository,
        private _instructorEarningsRepository: IInstructorEarningsRepository,
        private _learnerProgress: ILearnerProgressRepository,
        private _courseRepository: ICourseRepository,
        private _couponRepository: ICouponRepository,
        // private _favouriteRepository: IFavouriteRepository,
    ) { }

    async execute(sessionId: string): Promise<{ status: string }> {
        const session = await this.paymentGateway.retrieveCheckoutSession(sessionId);

        if (!session) {
            throw new AppError("Invalid session ID", STATUS_CODES.NOT_FOUND);
        }



        const paymentId = session.metadata.paymentId;
        const enrollmentId = session.metadata.referenceId;

        const paymentRecord = await this.paymentRepo.findById(paymentId);

        if (!paymentRecord) {
            throw new AppError("Payment record not found", STATUS_CODES.BAD_REQUEST)
        }

        // ❗ Prevent duplicate verification
        if (paymentRecord.status === PaymentStatus.Success) {
            return { status: "success" };
        }

        if (paymentRecord.status === PaymentStatus.Failed) {
            return { status: "failed" };
        }

        // 2. Check payment status from Stripe
        if (session.payment_status === "paid") {

            // Update Payment
            const payment = await this.paymentRepo.updateById(paymentId, {
                status: PaymentStatus.Success,
                paidAt: new Date(),
                transactionId: session.payment_intent,
                enrollmentId
            });

            if (!payment) {
                throw new AppError("Failed to activate payment", STATUS_CODES.BAD_REQUEST)
            }

            const enrollment = await this.enrollmentRepo.updateById(enrollmentId, {
                status: EnrollmentStatus.Active,
                enrolledAt: new Date(),
            });

            if (!enrollment) {
                throw new AppError("Failed to activate enrollment", STATUS_CODES.BAD_REQUEST)
            }

            // const isFavourite = await this._favouriteRepository.exists({
            //     learnerId: enrollment.learnerId,
            //     courseId: enrollment.courseId
            // })
            // if (isFavourite) {
            //     await this._favouriteRepository.remove({
            //         learnerId: enrollment.learnerId,
            //         courseId: enrollment.courseId
            //     })
            // }
            const instructorShare = payment.grossAmount * (100 - PLATFORM_CUT) / 100;
            const releaseAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            const instructorEarnings = await this._instructorEarningsRepository.create({
                instructorId: enrollment.instructorId,
                courseId: enrollment.courseId,
                amount: instructorShare,
                releaseAt,
                cancelledAt: null,
                status: EarningStatus.Pending,
                enrollmentId: enrollment.id
            });

            console.log(instructorEarnings);


            const instructorWallet = await this._instructorWalletReposotory.updateBalance({
                instructorId: enrollment.instructorId,
                pendingBalance: instructorShare
            });

            console.log(instructorWallet);


            const course = await this._courseRepository.incrementEnrollment(enrollment.courseId);

            if (!course) {
                throw new AppError("Failed to fetch course", STATUS_CODES.BAD_REQUEST)
            }

            const learnerProgress = await this._learnerProgress.create({
                learnerId: enrollment.learnerId,
                courseId: enrollment.courseId,
                completedChapters: [],
                progressPercentage: 0,
                currentChapterId: null,
                totalChapters: course.totalChapters,
                lastAccessedAt: null,
            });

            if (!learnerProgress) {
                throw new AppError("Failed to update initiate learner progress", STATUS_CODES.BAD_REQUEST, false)
            }

            if (payment.coupon) {
                await this._couponRepository.incrementUsage(payment.coupon)
            }

            return { status: "success" };
        }

        if (session.payment_status === "unpaid" || session.status === "expired") {

            await this.paymentRepo.updateById(paymentId, {
                status: PaymentStatus.Failed,
                transactionId: null,
                enrollmentId
            });

            await this.enrollmentRepo.updateById(enrollmentId, {
                status: EnrollmentStatus.Failed,
            });

        }

        return { status: "failed" };
    }
}
