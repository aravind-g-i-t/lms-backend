import { GetCourseDetailsForLearnerOutput } from "@application/dtos/course/GetCourseDetailsForLearner";
import { IGetCourseDetailsForLearnerUseCase } from "@application/IUseCases/course/IGetCourseDetailsForLearner";
import { Chapter } from "@domain/entities/Course";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class GetCourseDetailsForLearnerUseCase implements IGetCourseDetailsForLearnerUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IS3Service,
        private _enrollmentRepository: IEnrollmentRepository
    ) { }

    async execute({ courseId, learnerId }: { courseId: string, learnerId: string | null }): Promise<GetCourseDetailsForLearnerOutput> {
        const course = await this._courseRepository.findHydratedCourseById(courseId);
        if (!course) {
            throw new AppError("Failed to fetch course details.", STATUS_CODES.BAD_REQUEST)
        }
        const thumbnail = course.thumbnail
            ? await this._fileStorageService.getDownloadUrl(course.thumbnail)
            : null;
        const previewVideo = course.previewVideo
            ? await this._fileStorageService.getDownloadUrl(course.previewVideo)
            : null;
        const profilePic = course.instructor?.profilePic ? await this._fileStorageService.getDownloadUrl(course.instructor.profilePic) : null;
        let enrollment;
        if (learnerId) {
            enrollment = await this._enrollmentRepository.findOne({
                courseId: courseId,
                learnerId:learnerId,
                status:EnrollmentStatus.Active
            });
        }

        return this._toCourseDetails(
            { 
            ...course,
            thumbnail,
            previewVideo, 
            instructor: { ...course.instructor, profilePic}
            },
            {
                isEnrolled:enrollment?true:false,
                enrolledAt:enrollment?enrollment.enrolledAt:null
            }
    )
    }

    private _toCourseDetails(input: HydratedCourse, enrollmentStatus:{isEnrolled:boolean,enrolledAt:Date|null}): GetCourseDetailsForLearnerOutput {
        return {
            id: input.id,
            title: input.title,
            description: input.description,
            thumbnail: input.thumbnail,
            previewVideo: input.previewVideo,
            prerequisites: input.prerequisites,
            category: {
                id: input.category.id,
                name: input.category.name,
            },
            enrollmentCount: input.enrollmentCount,
            instructor: {
                id: input.instructor.id,
                name: input.instructor.name,
                profilePic: input.instructor.profilePic
            },
            modules: input.modules.map(module => ({
                ...module,
                chapters: module.chapters.map(chapter => this._toFilteredChapter(chapter))

            })),
            whatYouWillLearn: input.whatYouWillLearn,
            price: input.price,
            level: input.level,
            duration: input.duration,
            tags: input.tags,
            rating: input.rating,
            totalRatings: input.totalRatings,
            publishedAt: input.publishedAt,
            isEnrolled:enrollmentStatus.isEnrolled,
            enrolledAt:enrollmentStatus.enrolledAt
        }
    }

    private _toFilteredChapter(doc: Chapter): { title: string, description: string, id: string, duration: number } {
        return {
            title: doc.title,
            description: doc.description,
            id: doc.id,
            duration: doc.duration
        }
    }
}