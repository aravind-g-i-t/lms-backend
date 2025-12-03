export enum EnrollmentStatus {
    Pending= "pending",
    Active = "active",
    Completed = "completed",
    Cancelled = "cancelled",
    Failed="failed"
}




export interface Enrollment {
    id: string;
    learnerId: string;
    courseId: string;
    enrolledAt: Date|null;
    status: EnrollmentStatus;
    paymentId: string;
    certificate: string | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
    createdAt:Date;
    instructorId:string;
    courseTitle:string;
    instructorName:string
    thumbnail:string;
    duration:number;
}
