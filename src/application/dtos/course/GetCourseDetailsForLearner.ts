import { CourseLevel } from "@domain/entities/Course";

interface Chapter {
    id:string;
    title: string;
    description: string;
    duration: number;
}

interface Module {
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

export interface GetCourseDetailsForLearnerOutput {
    id: string;
    title: string;
    description: string;
    prerequisites: string[];
    category: {
        name:string;
        id:string;
    };
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
    isEnrolled:boolean;
    enrolledAt:Date | null;
    isFavourite:boolean;
    ratingDistribution:{
        1:number;
        2:number;
        3:number;
        4:number;
        5:number;
    }
}