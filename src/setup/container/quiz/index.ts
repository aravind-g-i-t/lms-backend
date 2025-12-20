import { CreateQuizUseCase } from "@application/useCases/course/CreateQuiz";
import { courseRepository } from "../course";
import { QuizController } from "@presentation/http/controllers/QuizController";
import { enrollmentRepository, learnerProgressRepository, quizRepository } from "../shared/dependencies";
import { UpdateQuizUseCase } from "@application/useCases/course/UpdateQuiz";
import { AddQuizQuestionUseCase } from "@application/useCases/course/AddQuizQuestion";
import { UpdateQuizQuesitonUseCase } from "@application/useCases/course/UpdateQuizQuestion";
import { DeleteQuizQuestionUseCase } from "@application/useCases/course/DeleteQuizQuestion";
import { DeleteQuizUseCase } from "@application/useCases/course/DeleteQuizUseCase";
import { GetQuizForLearnerUseCase } from "@application/useCases/course/GetQuizForLearner";
import { QuizAttemptRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/QuizAttemptRepository";
import { SubmitQuizAttemptUseCase } from "@application/useCases/course/SubmitQuizAttempt";
import { certificateRepository, issueCertificateUseCase } from "../certificate";
import { learnerRepository } from "../learner/learnerRepository";
import { GetCertificatesForLearnerUseCase } from "@application/useCases/certificate/GetCertificates";
import { s3Service } from "../shared/s3Controller";

export const quizAttemptRepository= new QuizAttemptRepository()

export const createQuizUseCase = new CreateQuizUseCase(quizRepository,courseRepository);

export const updateQuizUseCase = new UpdateQuizUseCase(quizRepository);

export const addQuestionUseCase = new AddQuizQuestionUseCase(quizRepository)

export const updateQuestionUseCase= new UpdateQuizQuesitonUseCase(quizRepository);

export const deleteQuestionUseCase = new DeleteQuizQuestionUseCase(quizRepository);

export const deleteQuizUseCase = new DeleteQuizUseCase(quizRepository,courseRepository);

export const getQuizForLearnerUseCase= new GetQuizForLearnerUseCase(learnerProgressRepository,quizRepository)

export const submitQuizAttemptUseCase = new SubmitQuizAttemptUseCase(quizRepository,quizAttemptRepository,enrollmentRepository,issueCertificateUseCase,learnerRepository)

export const getCertificatsUseCAse=new GetCertificatesForLearnerUseCase(certificateRepository,s3Service)

export const quizController = new QuizController(
    createQuizUseCase,
    updateQuizUseCase,
    addQuestionUseCase,
    updateQuestionUseCase,
    deleteQuestionUseCase,
    deleteQuizUseCase,
    getQuizForLearnerUseCase,
    submitQuizAttemptUseCase,
    getCertificatsUseCAse
)