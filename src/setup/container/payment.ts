import { CreatePaymentUseCase } from "@application/useCases/payment/CreatePayment";
import { paymentRepository, enrollmentRepository, stripeService, learnerProgressRepository } from "./shared/dependencies";
import { VerifyPaymentUseCase } from "@application/useCases/payment/VerifyPayment";
import { PaymentController } from "@presentation/controllers/PaymentController";
import { instructorEarningsRepository, instructorWalletRepository } from "./instructor/instructorRepository";
import { courseRepository } from "./shared/courseController";
import { couponRepository } from "./coupon";

export const createPaymentUseCase = new CreatePaymentUseCase(paymentRepository);

export const verifyPaymentUseCase = new VerifyPaymentUseCase(
    paymentRepository,
    enrollmentRepository,
    stripeService,
    instructorWalletRepository,
    instructorEarningsRepository,
    learnerProgressRepository,
    courseRepository,
    couponRepository
);

export const paymentController = new PaymentController(verifyPaymentUseCase);
