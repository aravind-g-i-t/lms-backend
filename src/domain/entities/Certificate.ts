export interface Certificate {
    id: string;
    learnerId: string;
    courseId: string;
    enrollmentId: string;
    quizAttemptId: string;
    certificateNumber: string;
    issuedAt: Date;
    certificateUrl: string;
    grade:number|null
    courseTitle: string;
    learnerName: string;
    instructorName: string;
}
