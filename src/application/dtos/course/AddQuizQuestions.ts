export interface AddQuizQuestionInput{
    quizId:string;
    question: string;
    options: string[];
    correctAnswer: number; 
    points: number;
    explanation: string|null; 
}