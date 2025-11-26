import { Payment } from "@domain/entities/Payment";

export interface IPaymentRepository {
  create(data: Partial<Payment>): Promise<Payment|null>;
  findOne(filter: Partial<Payment>): Promise<Payment | null>;
  findMany(filter: Partial<Payment>): Promise<Payment[]>;
  update(id: string, updates: Partial<Payment>): Promise<Payment | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Payment | null>; 
}
