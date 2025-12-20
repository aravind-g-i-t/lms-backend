import { QuizAttempt } from "@domain/entities/QuizAttempt";

export interface SubmitQuizAttemptInput{
    quizId:string,
    courseId:string,
    learnerId:string,
    answers:Answer[]
}

interface Answer{
    questionId: string;
    selectedOption: number;
}

export interface SubmitQuizAttemptOutput{
    quizAttempt:QuizAttempt;
}