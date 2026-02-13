
import { ICancelEnrollmentUseCase } from "@application/IUseCases/enrollment/ICancelEnrollment";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { EarningStatus } from "@domain/entities/InstructorEarning";
import { PaymentStatus } from "@domain/entities/Payment";
import { TransactionReason, TransactionType } from "@domain/entities/WalletTransaction";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { IWalletTransactionRepository } from "@domain/interfaces/IWalletTxnRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class CancelEnrollmentUseCase implements ICancelEnrollmentUseCase{
    constructor(
        private _enrollmentRepo:IEnrollmentRepository,
        private _paymentRepo:IPaymentRepository,
        private _instructorEarningsRepo:IInstructorEarningsRepository,
        private _walletRepo:IWalletRepository,
        private _instructorWalletRepo:IInstructorWalletRepository,
        private _walletTransactionRepo:IWalletTransactionRepository,
        private _courseRepository:ICourseRepository
    ){}

    async execute(input:{courseId:string; learnerId:string}):Promise<void>{
        const {courseId,learnerId} = input;
        const enrollment= await this._enrollmentRepo.findOne({
            courseId,
            learnerId,
            status:EnrollmentStatus.Active
        });
        console.log("Enrollment");
        
        if(!enrollment){
            throw new AppError(MESSAGES.ENROLLMENT_NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const payment= await this._paymentRepo.findById(enrollment.paymentId);
        console.log("Payment",payment);
        
        if(!payment){
            throw new AppError(MESSAGES.PAYMENT_NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const enrollmentCancelled= await this._enrollmentRepo.updateById(enrollment.id,{
            status:EnrollmentStatus.Cancelled,
            cancelledAt:new Date()
        });
        console.log("enrollmentCancelled",enrollmentCancelled);

        if(!enrollmentCancelled){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        const cancelledEarning= await this._instructorEarningsRepo.findOneAndUpdate(
            {
                enrollmentId:enrollment.id
            },
            {
                status:EarningStatus.Cancelled,
                cancelledAt:new Date()
            }
        )

        console.log("CancelledEarning",cancelledEarning);
        if(!cancelledEarning){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        const updatedWallet= await this._walletRepo.updateBalance(learnerId,payment.paidAmount);

        console.log("updatedWallet",updatedWallet);
        if(!updatedWallet){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        const walletTransaction= await this._walletTransactionRepo.create({
            walletId:updatedWallet.id,
            learnerId,
            type:TransactionType.Credit,
            reason:TransactionReason.Refund,
            amount:payment.paidAmount,
            enrollmentId:enrollment.id
        });

        console.log("walletTransaction",walletTransaction);

        if(!walletTransaction){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        const updatedInstructorWallet = await this._instructorWalletRepo.updateBalance({
            instructorId:enrollment.instructorId,
            pendingBalance:0-cancelledEarning.amount
        });

        console.log("updatedInstructorWallet",updatedInstructorWallet);

        if(!updatedInstructorWallet){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        const paymentUpdated= await this._paymentRepo.updateById(payment.id,
            {
                status:PaymentStatus.Refunded,
                refundedAt:new Date()
            }
        )
        console.log("paymentUpdated",paymentUpdated);

        if(!paymentUpdated){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        const courseUpdated= await this._courseRepository.decrementEnrollment(courseId);
        
        if(!courseUpdated){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }




    }
}