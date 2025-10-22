export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string|null;
    previewVideo: string|null; 
    preRequisites:string[];
    categoryId: string;
    subCategoryId: string;
    enrollmentCount:number;
    instructorId: string;
    sections:Section[];
    price: number|null;
    level: "beginner" | "intermediate" | "advanced";
    duration: number; 
    tags: string[];
    rating: number|null; 
    totalRatings: number;
    isActive:boolean;
    status: "draft"| "under_review"| "published"| "archived";
    publishedAt:Date|null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Section{
    title: string;
    description: string;
    duration:number;
    lectures: Lecture[]; 
}

export interface Lecture{
    title: string;
    description: string;
    thumbnail:string;
    videoUrl: string;
    duration: number;
    resources: string[];
}

