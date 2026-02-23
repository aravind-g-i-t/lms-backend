import { Payment } from "@domain/entities/Payment";
import { IBaseRepository } from "./IBaseRepository";

export interface MonthlyRevenue {
  year: number;
  month: number; 
  totalGrossAmount: number;
  instructorShare: number;
  companyRevenue: number;
}


export interface IPaymentRepository extends IBaseRepository<Payment> {
  getMonthlyCourseRevenue(
    startDate: Date,
    endDate: Date
  ): Promise<MonthlyRevenue[]>;
}
