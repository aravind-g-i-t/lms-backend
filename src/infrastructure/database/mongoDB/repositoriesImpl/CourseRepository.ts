import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { CourseModel, IChapter, IModule, VerificationStatus } from "../models/CourseModel";
import { logger } from "@infrastructure/logging/Logger";
import { CategoryEntity } from "./CategoryRepository";
import { InstructorEntity } from "./InstructorRepository";
import { CourseMapper } from "../mappers/CourseMapper";
import { CategoryDoc } from "../models/CategoryModel";
import { InstructorDoc } from "../models/InstructorModel";

enum CourseLevel {
    Beginner = "beginner",
    Intermediate = "intermediate",
    Advanced = "advanced",
}

enum CourseStatus {
    Draft = "draft",
    Published = "published",
    Archived = "archived",
}

export interface CourseEntity {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    previewVideo: string | null;
    prerequisites: string[];
    categoryId: string;
    enrollmentCount: number;
    instructorId: string;
    modules: IModule[];
    price: number;
    level: CourseLevel;
    duration: number;
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



export interface HydratedCourseEntity {

    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    previewVideo: string | null;
    prerequisites: string[];
    category: CategoryEntity;
    enrollmentCount: number;
    instructor: InstructorEntity;
    modules: IModule[];
    price: number;
    level: CourseLevel;
    duration: number;
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

interface FindAllInput {
    pageOptions: { page: number; limit: number };
    filter?: object;
    sort?: Record<string, 1 | -1>;
}

interface FindAllOutput {
    pagination: { totalPages: number; totalCount: number };
    courses: HydratedCourseEntity[];
}

export class CourseRepository implements ICourseRepository {
    async create(courseData: Partial<CourseEntity>): Promise<CourseEntity | null> {
        const course = new CourseModel(courseData);
        await course.save();
        return course ? CourseMapper.toDomain(course) : null;
    }

    async findById(id: string): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(id).lean().exec();
        return course ? CourseMapper.toDomain(course) : null;
    }

    async findByInstructor(instructorId: string): Promise<CourseEntity[]> {
        const courses = await CourseModel.find({ instructorId }).lean().exec();
        return courses.map(course => CourseMapper.toDomain(course));
    }

    async findHydratedCourseById(id: string): Promise<HydratedCourseEntity | null> {
        const course = await CourseModel.findById(id)
            .populate<{ categoryId: CategoryDoc }>("categoryId")
            .populate<{ instructorId: InstructorDoc }>("instructorId")
            .exec();
        return course ? CourseMapper.toHydrated(course) : null;
    }

    async findByCategory(categoryId: string): Promise<CourseEntity[]> {
        const courses = await CourseModel.find({ categoryId }).lean().exec();
        return courses.map(course => CourseMapper.toDomain(course));
    }

    async findAll(input: FindAllInput): Promise<FindAllOutput> {
        const { pageOptions, filter, sort } = input;
        const query = filter || {};
        const sortBy = sort || {};
        const { page, limit } = pageOptions;
        const skip = (page - 1) * limit;

        const [docs, totalCount] = await Promise.all([
            CourseModel.find(query)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .populate<{ categoryId: CategoryDoc }>("categoryId")
            .populate<{ instructorId: InstructorDoc }>("instructorId")
            .exec(),
            CourseModel.countDocuments(query),
        ]);

        if (docs) logger.info("Courses fetched successfully.");

        const courses = docs.map(doc => CourseMapper.toHydrated(doc));
        return {
            courses,
            pagination: {
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            },
        };
    }

    async update({ id, updates }: { id: string; updates: Partial<CourseEntity> }): Promise<CourseEntity | null> {
        const updated = await CourseModel.findByIdAndUpdate(id, updates, { new: true }).exec();
        return updated ? CourseMapper.toDomain(updated) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await CourseModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async changeStatus({ id, status }: { id: string; status: CourseEntity["status"] }): Promise<CourseEntity | null> {
        const updated = await CourseModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        return updated ? CourseMapper.toDomain(updated) : null;
    }

    async updateVerification({
        id,
        verification,
    }: {
        id: string;
        verification: CourseEntity["verification"];
    }): Promise<CourseEntity | null> {
        const updated = await CourseModel.findByIdAndUpdate(
            id,
            { verification },
            { new: true }
        ).exec();
        return updated ? CourseMapper.toDomain(updated) : null;
    }


    async incrementEnrollment({ id, count = 1 }: { id: string; count?: number }): Promise<CourseEntity | null> {
        const updated = await CourseModel.findByIdAndUpdate(
            id,
            { $inc: { enrollmentCount: count } },
            { new: true }
        ).exec();
        return updated ? CourseMapper.toDomain(updated) : null;
    }

    async addModule({ courseId, module }: { courseId: string; module: IModule }): Promise<CourseEntity | null> {
        const updated = await CourseModel.findByIdAndUpdate(
            courseId,
            { $push: { modules: module } },
            { new: true }
        ).exec();
        return updated ? CourseMapper.toDomain(updated) : null;
    }

    async removeModule({
        courseId,
        moduleId,
    }: {
        courseId: string;
        moduleId: string;
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;

        const removedDuration = module.duration || 0;

        // Remove the module manually
        course.modules = course.modules.filter(m => m.id !== moduleId);
        course.duration = (course.duration || 0) - removedDuration;

        await course.save();
        return CourseMapper.toDomain(course);
    }


    async updateModuleInfo({
        courseId,
        moduleId,
        updates,
    }: {
        courseId: string;
        moduleId: string;
        updates: { title: string; description: string };
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;


        module.title = updates.title;
        module.description = updates.description;

        await course.save();
        return CourseMapper.toDomain(course);
    }

    async addChapter({
        courseId,
        moduleId,
        chapter,
    }: {
        courseId: string;
        moduleId: string;
        chapter: IChapter;
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;


        module.chapters.push(chapter);

        const chapterDuration = chapter.duration || 0;
        module.duration += chapterDuration;
        course.duration += chapterDuration;

        await course.save();
        return CourseMapper.toDomain(course);
    }

    async removeChapter({
        courseId,
        moduleId,
        chapterId,
    }: {
        courseId: string;
        moduleId: string;
        chapterId: string;
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;

        const chapter = module.chapters.find(c => c.id === chapterId);
        if (!chapter) return null;

        const removedDuration = chapter.duration || 0;

        // Remove the chapter manually
        module.chapters = module.chapters.filter(c => c.id !== chapterId);

        // Update durations
        module.duration -= removedDuration;
        course.duration -= removedDuration;

        await course.save();
        return CourseMapper.toDomain(course);
    }


    async updateChapterInfo({
        courseId,
        moduleId,
        chapterId,
        updates,
    }: {
        courseId: string;
        moduleId: string;
        chapterId: string;
        updates: { title: string; description: string };
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;
        const chapter = module.chapters.find(c => c.id === chapterId);
        if (!chapter) return null;

        chapter.title = updates.title;
        chapter.description = updates.description;

        await course.save();
        return CourseMapper.toDomain(course);
    }

    async updateChapterVideo({
        courseId,
        moduleId,
        chapterId,
        video,
        duration,
    }: {
        courseId: string;
        moduleId: string;
        chapterId: string;
        video: string;
        duration: number;
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;
        const chapter = module.chapters.find(c => c.id === chapterId);
        if (!chapter) return null;

        const oldDuration = chapter.duration || 0;
        const durationDiff = duration - oldDuration;

        chapter.video = video;
        chapter.duration = duration;
        module.duration += durationDiff;
        course.duration += durationDiff;

        await course.save();
        return CourseMapper.toDomain(course);
    }

}
