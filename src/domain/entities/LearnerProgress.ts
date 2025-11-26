export interface LearnerProgress {
    id: string;
    learnerId: string;
    courseId: string;

    completedChapters: string[];
    progressPercentage: number;

    totalChapters: number;
    currentChapterId: string | null;
    
    lastAccessedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
}
