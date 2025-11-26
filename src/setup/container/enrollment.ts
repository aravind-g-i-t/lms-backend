import { enrollmentRepository, learnerProgressRepository, stripeService } from "./shared/dependencies";
import { createPaymentUseCase } from "./payment";
import { courseRepository } from "./shared/courseController";
import { InitiateEnrollmentUseCase } from "@application/useCases/enrollment/InitiateEnrollment";
import { CreateEnrollmentUseCase } from "@application/useCases/enrollment/CreateEnrollment";
import { EnrollmentController } from "@presentation/controllers/EnrollmentController";
import { instructorRepository } from "./instructor/instructorRepository";
import { GetEnrollmentsUseCase } from "@application/useCases/enrollment/GetEnrollments";
import { s3Service } from "./shared/s3Controller";

export const createEnrollmentUseCase = new CreateEnrollmentUseCase(enrollmentRepository);


export const initiateEnrollmentUseCase = new InitiateEnrollmentUseCase(
    courseRepository,
    createPaymentUseCase,
    createEnrollmentUseCase,
    stripeService,
    instructorRepository
);

export const getEnrollmentsUseCase = new GetEnrollmentsUseCase(enrollmentRepository,learnerProgressRepository,s3Service)

export const enrollmentController = new EnrollmentController(
    initiateEnrollmentUseCase,
    getEnrollmentsUseCase
);
