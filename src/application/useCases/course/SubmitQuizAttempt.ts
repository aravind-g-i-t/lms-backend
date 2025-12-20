import { SubmitQuizAttemptInput, SubmitQuizAttemptOutput } from "@application/dtos/course/SubmitQuizAttempt";
import { IIssueCertificateUseCase } from "@application/IUseCases/certificate/IIssueCertificate";
import { ISubmitQuizAttemptUseCase } from "@application/IUseCases/course/ISubmitQuizAttempt";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { QuizAttemptStatus } from "@domain/entities/QuizAttempt";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IQuizAttemptRepository } from "@domain/interfaces/IQuizAttemptRepository";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class SubmitQuizAttemptUseCase implements ISubmitQuizAttemptUseCase {
    constructor(
        private _quizRepository: IQuizRepository,
        private _quizAttemptRepository: IQuizAttemptRepository,
        private _enrollmentRepository: IEnrollmentRepository,
        private _issueCertificateUseCase: IIssueCertificateUseCase,
        private _learnerRepository: ILearnerRepository,
    ) {}

    async execute(input: SubmitQuizAttemptInput): Promise<SubmitQuizAttemptOutput> {
        const { quizId, courseId, learnerId, answers } = input;

        // Fetch quiz
        const quiz = await this._quizRepository.findById(quizId);
        if (!quiz) throw new AppError("Quiz not found", STATUS_CODES.NOT_FOUND);

        const questionMap = new Map(quiz.questions.map(q => [q.id, q]));

        let score = 0;
        let correctCount = 0;

        // Build answers array
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


        const exists = await this._quizAttemptRepository.findActiveAttempt(quizId, learnerId);
        if (exists) throw new AppError("You can only attend the quiz once.", STATUS_CODES.FORBIDDEN);

        console.log("exists",exists);
        
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
            throw new AppError("Failed to initiate quiz attempt",STATUS_CODES.BAD_REQUEST,false)
        }


        // Find enrollment
        const enrollment = await this._enrollmentRepository.findOne({
            courseId,
            learnerId,
            status: EnrollmentStatus.Active
        });

        if (!enrollment) throw new AppError("Enrollment not found", STATUS_CODES.NOT_FOUND);

        const learner = await this._learnerRepository.findById(learnerId);
        if (!learner) throw new AppError("Learner not found", STATUS_CODES.NOT_FOUND);

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

        await this._enrollmentRepository.update(enrollment.id, { certificate: certificateId ,completedAt:new Date()});

        return { quizAttempt: quizAttempt };
    }
}
