import { Payment } from "@domain/entities/Payment";

export interface MonthlyRevenue {
  year: number;
  month: number; 
  totalGrossAmount: number;
  instructorShare: number;
  companyRevenue: number;
}


export interface IPaymentRepository {
  create(data: Partial<Payment>): Promise<Payment | null>;
  findOne(filter: Partial<Payment>): Promise<Payment | null>;
  findMany(filter: Partial<Payment>): Promise<Payment[]>;
  updateById(id: string, updates: Partial<Payment>): Promise<Payment | null>;
  deleteById(id: string): Promise<boolean>;
  findById(id: string): Promise<Payment | null>;
  getMonthlyCourseRevenue(
    startDate: Date,
    endDate: Date
  ): Promise<MonthlyRevenue[]>;
}
