import { Quiz } from "@domain/entities/Quiz";
import { QuizDoc } from "../models/QuizModel";

export class QuizMapper {
    static toDomain(raw: QuizDoc): Quiz {

        return {
            id:raw._id.toString(),
            courseId:raw.courseId.toString(),
            passingScore:raw.passingScore,
            timeLimitMinutes:raw.timeLimitMinutes,
            totalPoints:raw.totalPoints,
            totalQuestions:raw.totalQuestions,
            questions:raw.questions,
            createdAt:raw.createdAt,
            updatedAt:raw.updatedAt,
            
        };
    }
}
