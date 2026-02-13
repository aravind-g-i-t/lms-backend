
import { InstructorController } from "@presentation/http/controllers/InstructorController";
import { addQuestionUseCase, applyForVerificationUseCase, cancelLiveSessionUseCase, createQuizUseCase, deleteQuestionUseCase, deleteQuizUseCase, endLiveSessionUseCase, getInstructorDashboardData, getInstructorDataUseCase, getInstructorEarningsUseCase, getInstructorsUseCase, getQuizForLearnerUseCase, getSessionListForInstructor, joinLiveSessionUseCase, scheduleLiveSessionUseCase, startLiveSessionUseCase, submitQuizAttemptUseCase, updateInstructorDataUseCase, updateInstructorPasswordUseCase, updateInstructorStatusUseCase, updateQuestionUseCase, updateQuizUseCase, updateVerificationStatusUseCase } from "./useCases";
import { QuizController } from "@presentation/http/controllers/QuizController";
import { getCertificatesUseCase } from "../admin/useCases";
import { LiveSessionController } from "@presentation/http/controllers/LiveSessionController";
import { getLiveSessionsForLearner } from "../learner/useCases";





export const instructorController=new InstructorController(
    getInstructorsUseCase,
    updateInstructorStatusUseCase,
    getInstructorDataUseCase,
    updateInstructorDataUseCase,
    updateInstructorPasswordUseCase,
    applyForVerificationUseCase,
    updateVerificationStatusUseCase,
    getInstructorEarningsUseCase,
    getInstructorDashboardData
);

export const quizController = new QuizController(
    createQuizUseCase,
    updateQuizUseCase,
    addQuestionUseCase,
    updateQuestionUseCase,
    deleteQuestionUseCase,
    deleteQuizUseCase,
    getQuizForLearnerUseCase,
    submitQuizAttemptUseCase,
    getCertificatesUseCase
)

export const liveSessionController = new LiveSessionController(
    scheduleLiveSessionUseCase,
    getSessionListForInstructor,
    startLiveSessionUseCase,
    joinLiveSessionUseCase,
    getLiveSessionsForLearner,
    endLiveSessionUseCase,
    cancelLiveSessionUseCase
)