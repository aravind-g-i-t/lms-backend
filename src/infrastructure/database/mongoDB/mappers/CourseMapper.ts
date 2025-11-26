import { CourseDoc, HydratedCourseDoc } from "../models/CourseModel";
import { CourseEntity, HydratedCourseEntity } from "../repositoriesImpl/CourseRepository";
import { CategoryMapper } from "./CategoryMapper";
import { InstructorMapper } from "./InstructorMapper";

export class CourseMapper {
    static toDomain(doc: CourseDoc): CourseEntity {
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
            totalModules: doc.duration,
            tags: doc.tags,
            rating: doc.rating,
            totalRatings: doc.totalRatings,
            status: doc.status,
            publishedAt: doc.publishedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            verification:doc.verification
        }
    }

    static toHydrated(doc:HydratedCourseDoc):HydratedCourseEntity{
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
            verification:doc.verification
        }
    }
}