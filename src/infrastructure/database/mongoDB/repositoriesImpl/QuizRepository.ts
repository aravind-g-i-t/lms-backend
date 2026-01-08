import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { Quiz } from "@domain/entities/Quiz";
import { QuizMapper } from "../mappers/QuizMapper";
import { QuestionDoc, QuizModel } from "../models/QuizModel";
import { BaseRepository } from "./BaseRepository";

export class QuizRepository extends BaseRepository<Quiz> implements IQuizRepository {

    constructor() {
        super(QuizModel, QuizMapper)
    }


    async addQuestion(
        quizId: string,
        questionData: {
            id: string;
            question: string;
            options: string[];
            correctAnswer: number;
            points: number;
            explanation: string | null;
        }
    ): Promise<Quiz | null> {

        const quiz = await QuizModel.findById(quizId);
        if (!quiz) return null;

        quiz.questions.push({
            id: questionData.id,
            question: questionData.question,
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            points: questionData.points,
            explanation: questionData.explanation,
            order: quiz.questions.length + 1
        });

        // quiz.questions.sort((a: any, b: any) => a.order - b.order);

        quiz.totalQuestions = quiz.questions.length;
        quiz.totalPoints = quiz.questions.reduce(
            (sum: number, q: QuestionDoc) => sum + q.points,
            0
        );
        await quiz.save();


        return QuizMapper.toDomain(quiz);
    }

    async updateQuestion(
        quizId: string,
        questionId: string,
        data: {
            question?: string;
            options?: string[];
            correctAnswer?: number;
            points?: number;
            explanation?: string | null;
            order?: number;
        }
    ): Promise<Quiz | null> {
        console.log(quizId, questionId, data);

        const quiz = await QuizModel.findById(quizId);
        if (!quiz) return null;

        const index = quiz.questions.findIndex(q => q.id === questionId);
        if (index === -1) return null;

        const existing = quiz.questions[index];

        // ✅ Create a plain object with all required fields
        const updatedQuestion = {
            id: existing.id, // Explicitly preserve custom id field
            question: data.question ?? existing.question,
            options: data.options ?? existing.options,
            correctAnswer: data.correctAnswer ?? existing.correctAnswer,
            points: data.points ?? existing.points,
            explanation: data.explanation ?? existing.explanation,
            order: data.order ?? existing.order,
            _id: existing._id
        };

        quiz.questions[index] = updatedQuestion;


        quiz.markModified('questions');

        quiz.totalQuestions = quiz.questions.length;
        quiz.totalPoints = quiz.questions.reduce(
            (sum: number, q: QuestionDoc) => sum + q.points,
            0
        );

        await quiz.save();

        return QuizMapper.toDomain(quiz);
    }


    async deleteQuestion(
        quizId: string,
        questionId: string
    ): Promise<Quiz | null> {

        const quiz = await QuizModel.findById(quizId);
        if (!quiz) return null;

        const index = quiz.questions.findIndex(q => q.id === questionId);
        if (index === -1) return null;

        quiz.questions.splice(index, 1);

        quiz.questions = quiz.questions.map((q, i) => ({
            ...q,
            order: i + 1
        }));

        quiz.totalQuestions = quiz.questions.length;
        quiz.totalPoints = quiz.questions.reduce(
            (sum: number, q: QuestionDoc) => sum + q.points,
            0
        );

        await quiz.save();

        return QuizMapper.toDomain(quiz);
    }

}
