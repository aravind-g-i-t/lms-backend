import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { CourseModel, IChapter, IModule, VerificationStatus } from "../models/CourseModel";
import { logger } from "@infrastructure/logging/Logger";
import { CategoryEntity } from "./CategoryRepository";
import { InstructorEntity } from "./InstructorRepository";
import { CourseMapper } from "../mappers/CourseMapper";
import { CategoryDoc } from "../models/CategoryModel";
import { InstructorDoc } from "../models/InstructorModel";
import { Resource } from "@domain/entities/Course";

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
    totalChapters: number;
    totalModules: number;
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
    totalChapters: number;
    totalModules: number;
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

export interface FindAllCoursesInput {
    pagination?: {
        page?: number;
        limit?: number;
    };
    search?: string;
    sort?: Record<keyof CourseEntity, "asc" | "desc">;

    filter?: {
        instructorIds?: string[];
        categoryIds?: string[];
        levels?: CourseLevel[];
        durationRange?: [number, number];
        priceRange?: [number, number];
        minRating?: number;
    };
}


interface FindAllInput {
    pageOptions: { page: number; limit: number };
    filter?: object;
    sort?: Record<keyof CourseEntity, 1 | -1>;
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
            .lean();
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

    async findAllCourses(input: FindAllCoursesInput): Promise<FindAllOutput> {
        const {
            search,
            filter,
            sort,
            pagination = { page: 1, limit: 10 },
        } = input;

        console.log("search", search);


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = { status: "published" };

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (filter?.instructorIds?.length) {
            query.instructorId = { $in: filter.instructorIds };
        }

        if (filter?.categoryIds?.length) {
            query.categoryId = { $in: filter.categoryIds };
        }

        if (filter?.levels?.length) {
            query.level = { $in: filter.levels };
        }

        if (filter?.durationRange) {
            const [min, max] = filter.durationRange;
            query.duration = { $gte: min, $lte: max };
        }

        if (filter?.priceRange) {
            const [min, max] = filter.priceRange;
            query.price = { $gte: min, $lte: max };
        }

        if (filter?.minRating) {
            query.rating = { $gte: filter.minRating };
        }

        query.status = CourseStatus.Published;
        query["verification.status"] = VerificationStatus.Verified

        const sortQuery: Record<string, 1 | -1> = {};
        if (sort) {
            for (const [key, direction] of Object.entries(sort)) {
                sortQuery[key] = direction === "asc" ? 1 : -1;
            }
        } else {
            sortQuery.rating = -1;
            sortQuery.enrollmentCount = -1;
            sortQuery.publishedAt = -1;
        }

        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;
        const skip = (page - 1) * limit;

        const totalCount = await CourseModel.countDocuments(query).exec();
        const totalPages = Math.ceil(totalCount / limit);

        const courses = await CourseModel.find(query)
            .populate<{ categoryId: CategoryDoc }>("categoryId")
            .populate<{ instructorId: InstructorDoc }>("instructorId")
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .exec();

        const hydratedCourses: HydratedCourseEntity[] = courses.map(course => CourseMapper.toHydrated(course));
        return {
            pagination: { totalPages, totalCount },
            courses: hydratedCourses,
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






    async addModule({
        courseId,
        module,
    }: {
        courseId: string;
        module: IModule;
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        course.modules.push(module);

        course.totalModules = course.modules.length;

        const newChaptersCount = module.chapters?.length || 0;
        course.totalChapters += newChaptersCount;

        const moduleDuration = module.duration || 0;
        course.duration += moduleDuration;

        await course.save();
        return CourseMapper.toDomain(course);
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
        course.duration -= removedDuration;

        const removedChaptersCount = module.chapters?.length || 0;
        course.totalChapters -= removedChaptersCount;

        course.modules = course.modules.filter(m => m.id !== moduleId);

        course.totalModules = course.modules.length;

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

        course.totalChapters += 1;

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

        module.chapters = module.chapters.filter(c => c.id !== chapterId);

        course.totalChapters -= 1;

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

    async incrementEnrollment(id: string): Promise<CourseEntity | null> {
        const updated = await CourseModel.findByIdAndUpdate(
            id,
            { $inc: { enrollmentCount: 1 } },
            { new: true }
        ).exec();

        if (!updated) return null;

        return CourseMapper.toDomain(updated);
    }

    async addResource({ courseId, moduleId, chapterId, resource }: { courseId: string; moduleId: string; chapterId: string; resource: Resource }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;
        const chapter = module.chapters.find(c => c.id === chapterId);
        if (!chapter) return null;

        chapter.resources.push(resource)
        await course.save();
        return CourseMapper.toDomain(course);
    }


    async removeResource({
        courseId,
        moduleId,
        chapterId,
        resourceId
    }: {
        courseId: string;
        moduleId: string;
        chapterId: string;
        resourceId:string;
    }): Promise<CourseEntity | null> {
        const course = await CourseModel.findById(courseId).exec();
        if (!course) return null;

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return null;

        const chapter = module.chapters.find(c => c.id === chapterId);
        if (!chapter) return null;

        chapter.resources= chapter.resources.filter(r => r.id !== resourceId);

        await course.save();
        return CourseMapper.toDomain(course);
    }
}

