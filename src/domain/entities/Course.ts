export enum CourseLevel {
    Beginner = "beginner",
    Intermediate = "intermediate",
    Advanced = "advanced"
}

export enum CourseStatus {
    Draft = "draft",
    Published = "published",
    Archived = "archived"
}

export enum VerificationStatus {
    NotVerified = "not_verified",
    UnderReview = "under_review",
    Verified = "verified",
    Rejected = "rejected",
    Blocked = "blocked"
}


export interface Resource {
    id:string
    name: string;
    file: string;
    size: number;
}

export interface Chapter {
    id:string;
    title: string;
    description: string;
    video: string;
    duration: number;
    resources: Resource[];
}
export interface Module {
    id:string;
    title: string;
    description: string;
    duration: number;
    chapters: Chapter[];
}





export interface Course {
    id: string;
    title: string;
    description: string;
    prerequisites: string[];
    categoryId: string;
    enrollmentCount: number;
    instructorId: string;
    modules: Module[];
    level: CourseLevel;
    duration: number;
    totalChapters:number;
    totalModules:number;
    tags: string[];
    whatYouWillLearn: string[];
    totalRatings: number;
    ratingDistribution:{
        5:number;
        4:number;
        3:number;
        2:number;
        1:number;
    };
    status: CourseStatus;
    createdAt: Date;
    updatedAt: Date;
    thumbnail: string | null;
    previewVideo: string | null;
    price: number;
    rating: number | null;
    verification: {
        status: VerificationStatus,
        reviewedAt: Date | null;
        submittedAt: Date | null;
        remarks: string | null
    }
    publishedAt: Date | null;
    quizId:string|null;
}
