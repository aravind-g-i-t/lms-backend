import { IVerifyPaymentUseCase } from "@application/IUseCases/payment/IVerifyPayment";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { EarningStatus } from "@domain/entities/InstructorEarning";
import { PaymentStatus } from "@domain/entities/Payment";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IPaymentGatewayService } from "@domain/interfaces/IPaymentGatewayService";
import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private paymentRepo: IPaymentRepository,
        private enrollmentRepo: IEnrollmentRepository,
        private paymentGateway: IPaymentGatewayService,
        private _instructorWalletReposotory: IInstructorWalletRepository,
        private _instructorEarningsRepository: IInstructorEarningsRepository,
        private _learnerProgress: ILearnerProgressRepository,
        private _courseRepository: ICourseRepository
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
            const payment = await this.paymentRepo.update(paymentId, {
                status: PaymentStatus.Success,
                paidAt: new Date(),
                transactionId: session.payment_intent,
                enrollmentId
            });

            if (!payment) {
                throw new AppError("Failed to activate payment", STATUS_CODES.BAD_REQUEST)
            }

            const enrollment = await this.enrollmentRepo.update(enrollmentId, {
                status: EnrollmentStatus.Active,
                enrolledAt: new Date(),
            });

            if (!enrollment) {
                throw new AppError("Failed to activate enrollment", STATUS_CODES.BAD_REQUEST)
            }
            const instructorShare = payment.grossAmount * 70 / 100;
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
            

            const instructorWallet=await this._instructorWalletReposotory.updateBalance({
                instructorId: enrollment.instructorId,
                pendingBalance: instructorShare
            });

            console.log(instructorWallet);
            

            const course = await this._courseRepository.incrementEnrollment(enrollment.courseId);

            if (!course) {
                throw new AppError("Failed to fetch course", STATUS_CODES.BAD_REQUEST)
            }

            const _learnerProgress = await this._learnerProgress.create({
                learnerId: enrollment.learnerId,
                courseId: enrollment.courseId,
                completedChapters: [],
                progressPercentage: 0,
                currentChapterId: null,
                totalChapters: course.totalChapters,
                lastAccessedAt: null,
            });

            console.log(_learnerProgress);
            

            return { status: "success" };
        }

        if (session.payment_status === "unpaid" || session.status === "expired") {

            await this.paymentRepo.update(paymentId, {
                status: PaymentStatus.Failed,
                transactionId: null,
            });

            await this.enrollmentRepo.update(enrollmentId, {
                status: EnrollmentStatus.Cancelled,
            });

        }

        return { status: "failed" };
    }
}
