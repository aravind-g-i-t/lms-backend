export interface IssueCertificateInput {
    learnerId: string;
    learnerName: string;
    courseId: string;
    enrollmentId:string;
    quizAttemptId:string;
    grade?: number | null;
    courseTitle: string;
    instructorName: string;
}