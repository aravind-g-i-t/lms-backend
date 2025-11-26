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


export enum ResourceType {
    PDF = "pdf",
    DOCS = "docs",
    EXE = "exe",
    ZIP = "zip",
    OTHER = "other"
}


export interface Chapter {
    id:string;
    title: string;
    description: string;
    video: string;
    duration: number;
    resources: Resource[];
}


export interface Resource {
    id:string
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
}
