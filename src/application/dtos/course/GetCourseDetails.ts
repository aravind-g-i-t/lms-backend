import { CourseLevel, CourseStatus, ResourceType, VerificationStatus } from "@domain/entities/Course";



export interface Chapter {
    id:string;
    title: string;
    description: string;
    video: string;
    duration: number;
    resources: Resource[];
}


export interface Resource {
    id:string;
    title: string;
    file: string;
    size: number;
    type: ResourceType;
}

export interface Module {
    id:string;
    title: string;
    description: string;
    duration: number;
    chapters: Chapter[];
}

interface Instructor {
    id: string;
    name: string;
    profilePic: string | null;

}

export interface Category {
    id: string;
    name: string;
}

export interface GetCourseDetailsOutput {
    id: string;
    title: string;
    description: string;
    prerequisites: string[];
    category: Category;
    enrollmentCount: number;
    instructor: Instructor;
    modules: Module[];
    level: CourseLevel;
    duration: number;
    tags: string[];
    whatYouWillLearn: string[];
    totalRatings: number;
    status: CourseStatus;
    createdAt: Date;
    updatedAt: Date;
    thumbnail: string | null;
    previewVideo: string | null;
    price: number;
    rating: number | null;
    publishedAt: Date | null;
    verification: {
        status: VerificationStatus,
        reviewedAt: Date | null;
        submittedAt: Date | null;
        remarks: string | null
    }
}
