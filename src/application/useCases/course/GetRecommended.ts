import { CourseForLearnerListing } from "@application/dtos/course/CourseDTO";
import { IGetRecommendedCoursesForLearnerUseCase } from "@application/IUseCases/course/IGetRecommended";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetRecommendedCoursesForLearnerUseCase implements IGetRecommendedCoursesForLearnerUseCase{
    constructor(
        private _enrollmentRepository: IEnrollmentRepository,
        private _courseRepository:ICourseRepository,
        private _fileStorageService:IFileStorageService
    ) { }

    async execute(input: { learnerId?: string, limit: number, courseId?:string }): Promise<CourseForLearnerListing[]> {
        const { learnerId, limit ,courseId} = input;
        let tags;
        let categoryIds;
        let excludeCourseIds
        if(learnerId){
            
            const enrolledCourseIds = await this._enrollmentRepository.getEnrolledCourseIdsByLearnerId(learnerId);
            if (!enrolledCourseIds.length) {
                return []
            }
            const interestSignals =
                await this._courseRepository.getInterestSignals(enrolledCourseIds);
            tags=interestSignals.tags;
            categoryIds=interestSignals.categoryIds;
            excludeCourseIds=enrolledCourseIds;
        }else if(courseId){
            const course=await this._courseRepository.findById(courseId);
            if(!course){
                throw new AppError(MESSAGES.COURSE_NOT_FOUND,STATUS_CODES.NOT_FOUND)
            }
            tags=course.tags;
            categoryIds=[course.categoryId]
            excludeCourseIds=[course.id]
        }

        const result= await this._courseRepository.getRecommendedCourses({
            tags:tags as string[],
            categoryIds:categoryIds as string[],
            excludeCourseIds: excludeCourseIds as string[],
            limit,
        });
        const courses = await Promise.all(
            result.map(async (course) => {
                const thumbnailURL = course.thumbnail
                    ? await this._fileStorageService.getViewURL(course.thumbnail)
                    : null;


                return this._toCourseForLearnerListing({
                    ...course,
                    thumbnail: thumbnailURL,
                });
            })
        );
        return courses
    }

    private _toCourseForLearnerListing(doc: HydratedCourse): CourseForLearnerListing {
            return {
                id: doc.id,
                title: doc.title,
                instructor: {
                    name: doc.instructor.name,
                    id: doc.instructor.id,
                },
                category: {
                    name: doc.category.name,
                    id: doc.category.id,
                },
                price: doc.price,
                rating: doc.rating,
                duration: doc.duration,
                level: doc.level,
                description: doc.description,
                thumbnail: doc.thumbnail,
                totalRatings: doc.totalRatings,
                totalModules:doc.totalModules,
                totalChapters:doc.totalChapters,
                enrollmentCount:doc.enrollmentCount
    
            }
        }
}