import { CourseLevel } from "@domain/entities/Course";

interface Instructor {
    id: string;
    name: string;
    profilePic: string | null;

}

 interface Category {
    id: string;
    name: string;
}

 interface Resource {
    id:string
    name: string;
    file: string;
    size: number;
}

 interface Chapter {
    id:string;
    title: string;
    description: string;
    video: string|null;
    duration: number;
    resources: Resource[];
}
 interface Module {
    id:string;
    title: string;
    description: string;
    duration: number;
    chapters: Chapter[];
}

export interface GetFullCourseForLearnerOutput {
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
    thumbnail: string | null;
    previewVideo: string | null;
    price: number;
    rating: number | null;
    publishedAt: Date | null;
    progressPercentage:number
    completedChapters:string[];
    totalChapters:number;
    currentChapterId:string|null;
}