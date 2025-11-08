import { Course } from "@domain/entities/Course";

export interface IUpdateCourseVerificationUseCase {
    execute(input: { courseId: string, status: string, remarks: string | null,submittedAt:Date }): Promise<Course["verification"]>
};