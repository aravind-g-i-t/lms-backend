import { Category } from "@domain/entities/Category";
import { Chapter, Course, CourseLevel, CourseStatus, Module, VerificationStatus } from "@domain/entities/Course";
import { Instructor } from "@domain/entities/Instructor";

interface FindAllInput {
    pageOptions: {
        page: number,
        limit: number
    },
    filter?: object,
    sort?: Record<string, number>
}

export interface FindAllCoursesInput {
    pagination?: {
        page?: number;
        limit?: number;
    };
    search?: string;
    sort?: Record<keyof Course, "asc" | "desc">;

    filter?: {
        instructorIds?: string[];
        categoryIds?: string[];
        levels?: CourseLevel[];
        durationRange?: [number, number];
        priceRange?: [number, number];
        minRating?: number;
    };
}




interface FindAllOutput {
    pagination: {
        totalPages: number,
        totalCount: number
    },
    courses: HydratedCourse[]
}

export interface HydratedCourse {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    previewVideo: string | null;
    prerequisites: string[];
    category: Category;
    enrollmentCount: number;
    instructor: Instructor;
    modules: Module[];
    price: number;
    level: CourseLevel;
    duration: number;
    totalChapters:number;
    totalModules:number;
    tags: string[];
    whatYouWillLearn: string[];
    rating: number | null;
    totalRatings: number;
    status: CourseStatus;
    verification: {
        status: VerificationStatus;
        reviewedAt: Date | null;
        submittedAt: Date | null;
        remarks: string | null;
    };
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;

}

export interface ICourseRepository {

    create(courseData: Partial<Course>): Promise<Course | null>;

    findById(id: string): Promise<Course | null>;

    findHydratedCourseById(id:string):Promise<HydratedCourse|null>;

    findByInstructor(instructorId: string): Promise<Course[]>;

    findByCategory(categoryId: string): Promise<Course[]>;

    findAll(input:FindAllInput):Promise<FindAllOutput>
    update(input:{id: string, updates: Partial<Course>}): Promise<Course | null>;

    findAllCourses(input:FindAllCoursesInput):Promise<FindAllOutput>

    delete(id: string): Promise<boolean>;

    incrementEnrollment(id:string): Promise<Course | null>;

    addModule(input:{courseId: string, module: Module}): Promise<Course | null>;

    removeModule(input:{courseId: string, moduleId: string}): Promise<Course | null>;

    updateModuleInfo(input:{courseId: string, moduleId: string,updates:{title:string,description:string}}): Promise<Course | null>;

    addChapter(input:{courseId: string, moduleId: string, chapter: Chapter}): Promise<Course | null>;

    removeChapter(input:{courseId: string, moduleId: string, chapterId: string}): Promise<Course | null>;

    updateChapterInfo(input:{courseId: string, moduleId: string, chapterId: string, updates:{title:string,description:string} }): Promise<Course | null>;

    updateChapterVideo({ courseId,moduleId,chapterId,video,duration}: {courseId: string;moduleId: string;chapterId: string;video: string;duration: number}): Promise<Course | null>;

}