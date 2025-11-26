export interface EnrollmentsForLearnerListing {
    id: string;
    courseId:string;
    courseTitle: string;
    thumbnail: string | null;
    instructor: { id: string; name: string };
    progressPercentage: number;
    totalChapters: number;
    completedChapters: number;
    lastAccessedAt: Date | null;
    enrolledAt: Date;
    duration: number;
}

export interface GetEnrollmentsOutput{
    data:EnrollmentsForLearnerListing[],
    total:number;
}