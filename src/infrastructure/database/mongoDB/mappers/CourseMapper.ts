import { Course } from "@domain/entities/Course";
import { CourseDoc, HydratedCourseDoc } from "../models/CourseModel";
import { HydratedCourseEntity } from "../repositoriesImpl/CourseRepository";
import { CategoryMapper } from "./CategoryMapper";
import { InstructorMapper } from "./InstructorMapper";
import { Types } from "mongoose";

export class CourseMapper {
    static toDomain(doc: CourseDoc): Course {
        return {
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            thumbnail: doc.thumbnail,
            previewVideo: doc.previewVideo,
            prerequisites: doc.prerequisites,
            categoryId: doc.categoryId.toString(),
            enrollmentCount: doc.enrollmentCount,
            instructorId: doc.instructorId.toString(),
            modules: doc.modules,
            whatYouWillLearn: doc.whatYouWillLearn,
            price: doc.price,
            level: doc.level,
            duration: doc.duration,
            totalChapters: doc.totalChapters,
            totalModules: doc.totalModules,
            tags: doc.tags,
            rating: doc.rating,
            totalRatings: doc.totalRatings,
            status: doc.status,
            publishedAt: doc.publishedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            verification: doc.verification,
            quizId: doc.quizId ? doc.quizId.toString() : null,
            ratingDistribution: doc.ratingDistribution
        }
    }

    static toHydrated(doc: HydratedCourseDoc): HydratedCourseEntity {
        return {
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            thumbnail: doc.thumbnail,
            previewVideo: doc.previewVideo,
            prerequisites: doc.prerequisites,
            category: CategoryMapper.toDomain(doc.categoryId),
            enrollmentCount: doc.enrollmentCount,
            instructor: InstructorMapper.toDomain(doc.instructorId),
            modules: doc.modules,
            whatYouWillLearn: doc.whatYouWillLearn,
            price: doc.price,
            level: doc.level,
            duration: doc.duration,
            totalChapters: doc.totalChapters,
            totalModules: doc.duration,
            tags: doc.tags,
            rating: doc.rating,
            totalRatings: doc.totalRatings,
            status: doc.status,
            publishedAt: doc.publishedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            verification: doc.verification,
            quizId: doc.quizId ? doc.quizId.toString() : null,
            ratingDistribution: doc.ratingDistribution
        }
    }

    static toPersistence(entity: Partial<Course>): Partial<CourseDoc> {
        const data: Partial<CourseDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.title !== undefined)
            data.title = entity.title;
        if (entity.description !== undefined)
            data.description = entity.description;
        if (entity.thumbnail !== undefined)
            data.thumbnail = entity.thumbnail;
        if (entity.previewVideo !== undefined)
            data.previewVideo = entity.previewVideo;
        if (entity.prerequisites !== undefined)
            data.prerequisites = entity.prerequisites;
        if (entity.categoryId !== undefined)
            data.categoryId = new Types.ObjectId(entity.categoryId);
        if (entity.enrollmentCount !== undefined)
            data.enrollmentCount = entity.enrollmentCount;
        if (entity.instructorId !== undefined)
            data.instructorId = new Types.ObjectId(entity.instructorId);
        if (entity.modules !== undefined) data.modules = entity.modules;
        if (entity.whatYouWillLearn !== undefined)
            data.whatYouWillLearn = entity.whatYouWillLearn;
        if (entity.price !== undefined) data.price = entity.price;
        if (entity.level !== undefined)
            data.level = entity.level;
        if (entity.duration !== undefined) data.duration = entity.duration;
        if (entity.totalChapters !== undefined)
            data.totalChapters = entity.totalChapters;
        if (entity.totalModules !== undefined) data.totalModules = entity.totalModules;
        if (entity.tags !== undefined) data.tags = entity.tags;
        if (entity.rating !== undefined) data.rating = entity.rating;
        if (entity.totalRatings !== undefined)
            data.totalRatings = entity.totalRatings;
        if (entity.verification !== undefined)
            data.verification = entity.verification;
        if (entity.quizId !== undefined)
            data.quizId = entity.quizId? new Types.ObjectId(entity.quizId):null;
        if (entity.ratingDistribution !== undefined)
            data.ratingDistribution = entity.ratingDistribution;
        if (entity.status !== undefined) data.status = entity.status;
        if (entity.publishedAt !== undefined)
            data.publishedAt = entity.publishedAt;
        if (entity.createdAt !== undefined) data.createdAt = entity.createdAt;
        if (entity.updatedAt !== undefined)
            data.updatedAt = entity.updatedAt;
        return data;
    }
}