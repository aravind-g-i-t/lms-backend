export enum QuizAttemptStatus {
    InProgress = "in_progress",
    Passed = "passed",
    Abandoned = "abandoned",
    Failed="failed"
}

export interface QuizAttempt {
    id: string;
    quizId: string;
    learnerId: string;
    courseId: string;
    status: QuizAttemptStatus;
    submittedAt: Date | null;
    score: number | null; 
    maxScore: number; 
    percentage: number | null;
    timeTakenSeconds: number | null;
    correctAnswers: number | null; 
    totalQuestions: number;
    answers: QuizAnswer[];
    createdAt: Date;
}

export interface QuizAnswer {
    questionId: string;
    selectedOption: number | null;
    isCorrect: boolean | null;
    pointsEarned: number;
}