import { GetInstructorsUseCase } from "@application/useCases/instructor/GetInstructors";
import { instructorEarningsRepository, instructorRepository, instructorWalletRepository, liveSessionRepository, quizRepository } from "./repositories";
import { s3Service } from "../shared/services";
import { UpdateInstructorStatusUseCase } from "@application/useCases/instructor/UpdateInstructorStatus";
import { GetInstructorDataUseCase } from "@application/useCases/instructor/GetInstructorData";
import { UpdateInstructorPasswordUseCase } from "@application/useCases/instructor/UpdatePassword";
import { UpdateInstructorDataUseCase } from "@application/useCases/instructor/UpdateInstructorData";
import { InstructorApplyForVeficationUseCase } from "@application/useCases/instructor/ApplyForVerification";
import { UpdateInstructorVerificationStatusUseCase } from "@application/useCases/instructor/UpdateVerificationStatus";
import { CreateQuizUseCase } from "@application/useCases/course/CreateQuiz";
import { courseRepository } from "../shared/repositories";
import { UpdateQuizUseCase } from "@application/useCases/course/UpdateQuiz";
import { AddQuizQuestionUseCase } from "@application/useCases/course/AddQuizQuestion";
import { UpdateQuizQuesitonUseCase } from "@application/useCases/course/UpdateQuizQuestion";
import { DeleteQuizQuestionUseCase } from "@application/useCases/course/DeleteQuizQuestion";
import { DeleteQuizUseCase } from "@application/useCases/course/DeleteQuizUseCase";
import { GetQuizForLearnerUseCase } from "@application/useCases/course/GetQuizForLearner";
import { enrollmentRepository, learnerProgressRepository, learnerRepository, quizAttemptRepository } from "../learner/repostitories";
import { SubmitQuizAttemptUseCase } from "@application/useCases/course/SubmitQuizAttempt";
import { issueCertificateUseCase } from "../shared/useCases";
import { GetSessionListForInstructorUseCase } from "@application/useCases/liveSession/GetSessionListForInstructor";
import { ScheduleLiveSessionUseCase } from "@application/useCases/liveSession/ScheduleLiveSession";
import { StartLiveSessionUseCase } from "@application/useCases/liveSession/StartLiveSession";
import { JoinLiveSessionUseCase } from "@application/useCases/liveSession/JoinLiveSession";
import { EndLiveSessionUseCase } from "@application/useCases/liveSession/EndLIveSession";
import { GetInstructorWalletAndEarningsUseCase } from "@application/useCases/instructor/GetInstructorEarnings";
import { GetInstructorDashboardUseCase } from "@application/useCases/instructor/GetInstructorDashboard";
import { CancelLiveSessionUseCase } from "@application/useCases/liveSession/CancelLiveSession";
import { ReleaseInstructorEarningsUseCase } from "@application/useCases/payment/ReleaseInstructorEarnings";

export const getInstructorsUseCase = new GetInstructorsUseCase(instructorRepository,s3Service);

export const updateInstructorStatusUseCase=new UpdateInstructorStatusUseCase(instructorRepository);

export const getInstructorDataUseCase=new GetInstructorDataUseCase(instructorRepository,s3Service)

export const updateInstructorPasswordUseCase=new UpdateInstructorPasswordUseCase(instructorRepository);

export const updateInstructorDataUseCase=new UpdateInstructorDataUseCase(instructorRepository)

export const applyForVerificationUseCase=new InstructorApplyForVeficationUseCase(instructorRepository);

export const updateVerificationStatusUseCase=new UpdateInstructorVerificationStatusUseCase(instructorRepository);

export const createQuizUseCase = new CreateQuizUseCase(quizRepository,courseRepository);

export const updateQuizUseCase = new UpdateQuizUseCase(quizRepository);

export const addQuestionUseCase = new AddQuizQuestionUseCase(quizRepository)

export const updateQuestionUseCase= new UpdateQuizQuesitonUseCase(quizRepository);

export const deleteQuestionUseCase = new DeleteQuizQuestionUseCase(quizRepository);

export const deleteQuizUseCase = new DeleteQuizUseCase(quizRepository,courseRepository);

export const getQuizForLearnerUseCase= new GetQuizForLearnerUseCase(learnerProgressRepository,quizRepository)

export const submitQuizAttemptUseCase = new SubmitQuizAttemptUseCase(quizRepository,quizAttemptRepository,enrollmentRepository,issueCertificateUseCase,learnerRepository,learnerProgressRepository)

export const scheduleLiveSessionUseCase= new ScheduleLiveSessionUseCase(liveSessionRepository,courseRepository,instructorRepository);

export const getSessionListForInstructor= new GetSessionListForInstructorUseCase(liveSessionRepository)

export const startLiveSessionUseCase= new StartLiveSessionUseCase(liveSessionRepository)

export const joinLiveSessionUseCase= new JoinLiveSessionUseCase(liveSessionRepository,enrollmentRepository)

export const endLiveSessionUseCase= new EndLiveSessionUseCase(liveSessionRepository);

export const cancelLiveSessionUseCase= new CancelLiveSessionUseCase(liveSessionRepository)

export const getInstructorEarningsUseCase= new GetInstructorWalletAndEarningsUseCase(instructorWalletRepository,instructorEarningsRepository)

export const getInstructorDashboardData= new GetInstructorDashboardUseCase(courseRepository,liveSessionRepository,instructorWalletRepository,s3Service)

export const releaseInstructorEarningsUseCase= new ReleaseInstructorEarningsUseCase(instructorWalletRepository,instructorEarningsRepository)