interface QuizQuestion{
    id: string;
    question: string;
    options: string[];
    points: number;
    order: number;
}

export interface QuizForLearner{
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

export interface IGetQuizForLearnerUseCase{
    execute(input:{courseId:string,learnerId:string}):Promise<QuizForLearner>
}