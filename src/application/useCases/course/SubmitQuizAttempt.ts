import { SubmitQuizAttemptInput, SubmitQuizAttemptOutput } from "@application/dtos/course/SubmitQuizAttempt";
import { IIssueCertificateUseCase } from "@application/IUseCases/certificate/IIssueCertificate";
import { ISubmitQuizAttemptUseCase } from "@application/IUseCases/course/ISubmitQuizAttempt";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { QuizStatus } from "@domain/entities/LearnerProgress";
import { QuizAttemptStatus } from "@domain/entities/QuizAttempt";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IQuizAttemptRepository } from "@domain/interfaces/IQuizAttemptRepository";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class SubmitQuizAttemptUseCase implements ISubmitQuizAttemptUseCase {
    constructor(
        private _quizRepository: IQuizRepository,
        private _quizAttemptRepository: IQuizAttemptRepository,
        private _enrollmentRepository: IEnrollmentRepository,
        private _issueCertificateUseCase: IIssueCertificateUseCase,
        private _learnerRepository: ILearnerRepository,
        private _learnerProgressRepository:ILearnerProgressRepository
    ) {}

    async execute(input: SubmitQuizAttemptInput): Promise<SubmitQuizAttemptOutput> {
        const { quizId, courseId, learnerId, answers } = input;
        
        const quiz = await this._quizRepository.findById(quizId);
        
        if (!quiz) throw new AppError(MESSAGES.QUIZ_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        const questionMap = new Map(quiz.questions.map(q => [q.id, q]));
        

        let score = 0;
        let correctCount = 0;

        const builtAnswers = answers.map(a => {
            const q = questionMap.get(a.questionId);
            if (!q) throw new AppError(`Invalid question ID: ${a.questionId}`, 400);

            const isCorrect = q.correctAnswer === a.selectedOption;
            const pointsEarned = isCorrect ? q.points : 0;

            if (isCorrect) {
                correctCount++;
                score += q.points;
            }

            return {
                questionId: a.questionId,
                selectedOption: a.selectedOption,
                isCorrect,
                pointsEarned
            };
        });
        

        const percentage = Math.round((score / quiz.totalPoints) * 100);
        const passed = quiz.passingScore == null ? true : percentage >= quiz.passingScore;


        const exists = await this._quizAttemptRepository.findOne({quizId, learnerId});
        
        if (exists) throw new AppError("You can only attend the quiz once.", STATUS_CODES.FORBIDDEN);

        
        const quizAttempt= await this._quizAttemptRepository.create({
            quizId:quiz.id,
            learnerId,
            courseId,
            status:passed?QuizAttemptStatus.Passed:QuizAttemptStatus.Failed,
            submittedAt:new Date(),
            score,
            maxScore:quiz.totalPoints,
            percentage,
            timeTakenSeconds:null,
            correctAnswers:correctCount,
            totalQuestions:quiz.totalQuestions,
            answers:builtAnswers
        });

        
        if(!quizAttempt){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }

        const progressUpdated= await this._learnerProgressRepository.findByLearnerAndCourseAndUpdate(learnerId,courseId,{
            quizAttemptId:quizAttempt.id,
            quizAttemptStatus:passed?QuizStatus.Passed:QuizStatus.Failed
        });

        if(!progressUpdated){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }


        // Find enrollment
        const enrollment = await this._enrollmentRepository.findOne({
            courseId,
            learnerId,
            status: EnrollmentStatus.Active
        });
        
        if (!enrollment) throw new AppError(MESSAGES.ENROLLMENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        const learner = await this._learnerRepository.findById(learnerId);
        if (!learner) throw new AppError(MESSAGES.LEARNER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        let certificateId: string | null = null;

        if (passed) {
            certificateId = await this._issueCertificateUseCase.execute({
                learnerId,
                learnerName: learner.name,
                instructorName: enrollment.instructorName,
                courseId,
                courseTitle: enrollment.courseTitle,
                quizAttemptId: quizAttempt.id,
                grade: quizAttempt.percentage,
                enrollmentId: enrollment.id
            });
        }

        const enrollmentUpdated= await this._enrollmentRepository.updateById(enrollment.id, { certificate: certificateId ,completedAt:new Date()});
        return { 
            quizAttempt: quizAttempt,
            questions:quiz.questions
        };
    }
}
