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
        console.log(input);
        
        // Fetch quiz
        const quiz = await this._quizRepository.findById(quizId);
        console.log("quiz:",quiz);
        
        if (!quiz) throw new AppError("Quiz not found", STATUS_CODES.NOT_FOUND);

        const questionMap = new Map(quiz.questions.map(q => [q.id, q]));
        console.log("questionMap:",questionMap);
        

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
        console.log("builtAnswers:",builtAnswers);
        

        const percentage = Math.round((score / quiz.totalPoints) * 100);
        const passed = quiz.passingScore == null ? true : percentage >= quiz.passingScore;


        const exists = await this._quizAttemptRepository.findOne({quizId, learnerId});
        console.log("exists",exists);
        
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

        console.log("quizAttempt",quizAttempt);
        
        if(!quizAttempt){
            throw new AppError("Failed to initiate quiz attempt",STATUS_CODES.BAD_REQUEST,false);
        }

        const progressUpdated= await this._learnerProgressRepository.findByLearnerAndCourseAndUpdate(learnerId,courseId,{
            quizAttemptId:quizAttempt.id,
            quizAttemptStatus:passed?QuizStatus.Passed:QuizStatus.Failed
        });
        console.log("progressUpdated",progressUpdated);

        if(!progressUpdated){
            throw new AppError("Failed to update progress.",STATUS_CODES.BAD_REQUEST,false);
        }


        // Find enrollment
        const enrollment = await this._enrollmentRepository.findOne({
            courseId,
            learnerId,
            status: EnrollmentStatus.Active
        });
        
        console.log("enrollment",enrollment);
        if (!enrollment) throw new AppError("Enrollment not found", STATUS_CODES.NOT_FOUND);

        const learner = await this._learnerRepository.findById(learnerId);
        console.log("learner",learner);
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
        console.log("certificateId",certificateId);

        const enrollmentUpdated= await this._enrollmentRepository.updateById(enrollment.id, { certificate: certificateId ,completedAt:new Date()});
        console.log("enrollmentUpdated",enrollmentUpdated);
        return { quizAttempt: quizAttempt };
    }
}
