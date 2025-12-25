export enum QuizStatus {
    NOtAttended= "not_attended",
    Passed = "passed",
    Failed="failed"
}

export interface LearnerProgress {
    id: string;
    learnerId: string;
    courseId: string;

    completedChapters: string[];
    progressPercentage: number;

    totalChapters: number;
    currentChapterId: string | null;

    quizAttemptStatus:QuizStatus,
    quizAttemptId:string |null
    
    lastAccessedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
}
