export interface UpdateQuizQuestionInput {
    quizId: string,
    questionId: string,
    question?: string;
    options?: string[];
    correctAnswer?: number;
    points?: number;
    explanation?: string | null;
    order?: number;
}