export enum EarningStatus{
    Pending="pending",
    Released="released",
    Cancelled="cancelled"
}

export interface InstructorEarnings {
    id: string;
    instructorId: string;
    courseId: string;
    enrollmentId: string;
    amount: number;
    createdAt: Date;
    releaseAt: Date;
    cancelledAt:Date|null;
    status: EarningStatus;
}
