import { EnrollmentRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/EnrollmentRepository";
import { LearnerProgressRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/LearnerProgressRepo";
import { PaymentRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/PaymentRepository";
import { QuizRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/QuizRepository";
import { StripeService } from "@infrastructure/services/StripeService";



export const paymentRepository = new PaymentRepositoryImpl();
export const enrollmentRepository = new EnrollmentRepositoryImpl();
export const stripeService = new StripeService();
export const learnerProgressRepository= new LearnerProgressRepository();
export const quizRepository= new QuizRepository()

