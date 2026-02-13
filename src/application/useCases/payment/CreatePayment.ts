import { ICreatePaymentUseCase } from "@application/IUseCases/payment/ICreatePayment";
import { PayerType, Payment, PaymentMethod, PaymentReason, PaymentStatus } from "@domain/entities/Payment";
import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class CreatePaymentUseCase implements ICreatePaymentUseCase{
    constructor(
        private _paymentRepository:IPaymentRepository
    ){}
    
    async execute(input: {coupon:string|null,payerId:string,payerType:string,grossAmount:number,paidAmount:number,discount:number,status:string,method:string,transactionId:string|null ,reason:string}): Promise<Payment> {
        const {coupon,payerId,payerType,grossAmount,paidAmount,discount,status,method,transactionId ,reason}=input;
        const newPayment= await this._paymentRepository.create({
            coupon,
            payerId,
            payerType:payerType as PayerType,
            grossAmount,
            paidAmount,
            discount,
            status:status as PaymentStatus,
            method:method as PaymentMethod,
            paidAt:status==="success"?new Date:null,
            transactionId,
            refundedAt:null,
            createdAt:new Date(),
            enrollmentId:null,
            reason:reason as PaymentReason
        });
        if(!newPayment){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        return newPayment
    }
}


