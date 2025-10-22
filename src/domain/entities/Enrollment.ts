export interface Enrollment {
    id: string;
    learnerId: string;
    courseId: string;
    enrolledAt: Date;
    status: "active" | "completed" | "cancelled";
    progress: {
        currentSection: number|null;
        currentLecture: number|null;
    };
    certificateIssued: boolean;
    createdAt: Date;
    updatedAt: Date;
}