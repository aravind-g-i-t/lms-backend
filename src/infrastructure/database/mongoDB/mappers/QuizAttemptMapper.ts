import { Types } from "mongoose";
import {  QuizAttemptDoc } from "../models/QuizAttempt";
import {  QuizAttempt } from "@domain/entities/QuizAttempt";

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
            answers:raw.answers,
            createdAt:raw.createdAt
        };
    }



    static toPersistence(entity: Partial<QuizAttempt>): Partial<QuizAttemptDoc> {

        const data: Partial<QuizAttemptDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.quizId !== undefined)
            data.quizId = new Types.ObjectId(entity.quizId);
        if (entity.status !== undefined)
            data.status = entity.status;
        if (entity.submittedAt !== undefined)
            data.submittedAt = entity.submittedAt;
        if (entity.score !== undefined)
            data.score = entity.score;
        if (entity.maxScore !== undefined)
            data.maxScore = entity.maxScore;

        if (entity.percentage !== undefined)
            data.percentage = entity.percentage;
        if (entity.timeTakenSeconds !== undefined)
            data.timeTakenSeconds = entity.timeTakenSeconds;
        if (entity.correctAnswers !== undefined)
            data.correctAnswers = entity.correctAnswers;
        if (entity.totalQuestions !== undefined)
            data.totalQuestions = entity.totalQuestions;
        if (entity.answers !== undefined)
            data.answers = entity.answers;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;

        return data;
    }

}