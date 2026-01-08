import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { PaymentModel } from "../models/PaymentModel";
import { PaymentMapper } from "../mappers/PaymentMapper";
import { Payment } from "@domain/entities/Payment";
import { BaseRepository } from "./BaseRepository";




export class PaymentRepositoryImpl extends BaseRepository<Payment> implements IPaymentRepository {

    constructor(){
        super(PaymentModel,PaymentMapper)
    }

    async findMany(filter: Partial<Payment>): Promise<Payment[]> {
        const results = await PaymentModel.find(filter).exec();
        return results.map(r => PaymentMapper.toDomain(r));
    }


}
