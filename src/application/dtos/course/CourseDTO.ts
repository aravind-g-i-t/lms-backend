import { CourseLevel, CourseStatus, VerificationStatus } from "@domain/entities/Course";

export interface CourseForInstructorListing{
    id: string;
    title: string;
    enrollmentCount: number;
    level: CourseLevel;
    duration: number;
    status: CourseStatus;
    createdAt: Date;
    thumbnail: string | null;
    price: number;
    rating: number | null;
    verification:{
        status:VerificationStatus;
    }
}

export interface CourseForAdminListing{
    id: string;
    title: string;
    status: CourseStatus;
    thumbnail: string | null;
    price: number;
    instructor:{
        id:string;
        name:string;
    },
    category:{
        id:string;
        name:string;
    },
    verification:{
        status:VerificationStatus;
    },
}