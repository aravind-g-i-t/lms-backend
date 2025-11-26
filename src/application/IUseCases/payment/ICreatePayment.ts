import { Payment } from "@domain/entities/Payment";

export interface ICreatePaymentUseCase{
    execute(input:{coupon:string|null,payerId:string,payerType:string,grossAmount:number,paidAmount:number,discount:number,status:string,method:string,transactionId:string|null ,reason:string}):Promise<Payment>
}