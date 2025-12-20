export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; 
    points: number;
    explanation: string|null; 
    order: number;
}

export interface Quiz {
    id: string;
    courseId: string; 
    passingScore: number|null;
    timeLimitMinutes: number | null;
    questions: QuizQuestion[];
    totalPoints: number;
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}