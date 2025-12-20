import { QuizAnswerDoc, QuizAttemptDoc } from "../models/QuizAttempt";
import { QuizAnswer, QuizAttempt } from "@domain/entities/QuizAttempt";

export class QuizAttemptMapper {
    constructor(){}
    static toDomain(raw: QuizAttemptDoc): QuizAttempt {

        return {
            id:raw._id.toString(),
            learnerId:raw.learnerId.toString(),
            courseId:raw.courseId.toString(),
            quizId:raw.quizId.toString(),
            status:raw.status,
            submittedAt:raw.submittedAt,
            score:raw.score,
            maxScore:raw.maxScore,

            percentage:raw.percentage,
            timeTakenSeconds:raw.timeTakenSeconds,
            correctAnswers:raw.correctAnswers,
            totalQuestions:raw.totalQuestions,
            answers:raw.answers.map(ans=>this.toQuizAnswerDomain(ans)),
            createdAt:raw.createdAt
        };
    }

    static toQuizAnswerDomain(raw:QuizAnswerDoc):QuizAnswer{
        return {
            questionId:raw.questionId.toString(),
            selectedOption:raw.selectedOption,
            isCorrect:raw.isCorrect,
            pointsEarned:raw.pointsEarned
        }
    }
}
