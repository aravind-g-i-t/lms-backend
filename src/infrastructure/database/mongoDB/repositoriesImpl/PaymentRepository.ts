import { IPaymentRepository, MonthlyRevenue } from "@domain/interfaces/IPaymentRepository";
import { PaymentDoc, PaymentModel } from "../models/PaymentModel";
import { PaymentMapper } from "../mappers/PaymentMapper";
import { Payment, PaymentReason, PaymentStatus } from "@domain/entities/Payment";
import { BaseRepository } from "./BaseRepository";




export class PaymentRepositoryImpl extends BaseRepository<Payment,PaymentDoc> implements IPaymentRepository {

    constructor() {
        super(PaymentModel, PaymentMapper)
    }

    async findMany(filter: Partial<Payment>): Promise<Payment[]> {
        const results = await PaymentModel.find(filter).exec();
        return results.map(r => PaymentMapper.toDomain(r));
    }


    async getMonthlyCourseRevenue(
        startDate: Date,
        endDate: Date
    ): Promise<MonthlyRevenue[]> {

        const results = await PaymentModel.aggregate([
            {
                $match: {
                    reason: PaymentReason.CourseEnrollment,
                    status: PaymentStatus.Success,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    grossAmount: 1,
                    paidAmount: 1,
                    instructorShare: {
                        $multiply: ["$grossAmount", 0.7]
                    },
                    companyRevenue: {
                        $subtract: [
                            "$paidAmount",
                            { $multiply: ["$grossAmount", 0.7] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month"
                    },
                    totalGrossAmount: { $sum: "$grossAmount" },
                    instructorShare: { $sum: "$instructorShare" },
                    companyRevenue: { $sum: "$companyRevenue" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalGrossAmount: 1,
                    instructorShare: 1,
                    companyRevenue: 1
                }
            },
            {
                $sort: { year: 1, month: 1 }
            }
        ]);

        return results;
    }

    async getTotalRevenue(): Promise<{ totalGrossRevenue: number; instructorShare: number; companyRevenue: number }> {
        const results = await PaymentModel.aggregate([
            {
                $match: {
                    reason: PaymentReason.CourseEnrollment,
                    status: PaymentStatus.Success,
                }
            },
            {
                $project: {
                    grossAmount: 1,
                    paidAmount: 1,
                    instructorShare: {
                        $multiply: ["$grossAmount", 0.7]
                    },
                    companyRevenue: {
                        $subtract: [
                            "$paidAmount",
                            { $multiply: ["$grossAmount", 0.7] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalGrossRevenue: { $sum: "$paidAmount" },
                    instructorShare: { $sum: "$instructorShare" },
                    companyRevenue: { $sum: "$companyRevenue" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalGrossRevenue: 1,
                    instructorShare: 1,
                    companyRevenue: 1
                }
            }
        ]);        

        return results.length > 0 ? results[0] : { totalGrossRevenue: 0, instructorShare: 0, companyRevenue: 0 };
    }

    
}