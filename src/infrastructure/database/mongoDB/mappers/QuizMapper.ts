import { Quiz } from "@domain/entities/Quiz";
import { QuizDoc } from "../models/QuizModel";
import { Types } from "mongoose";

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

    static toPersistence(entity: Partial<Quiz>): Partial<QuizDoc> {

        const data: Partial<QuizDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.passingScore !== undefined)
            data.passingScore = entity.passingScore;
        if (entity.timeLimitMinutes !== undefined)
            data.timeLimitMinutes = entity.timeLimitMinutes;
        if (entity.totalPoints !== undefined)
            data.totalPoints = entity.totalPoints;
        if (entity.totalQuestions !== undefined)
            data.totalQuestions = entity.totalQuestions;
        if (entity.questions !== undefined)
            data.questions = entity.questions;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.updatedAt !== undefined)
            data.updatedAt = entity.updatedAt;

        return data;
    } 
}  