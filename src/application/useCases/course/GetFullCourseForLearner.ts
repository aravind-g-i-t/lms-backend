import { GetFullCourseForLearnerOutput } from "@application/dtos/course/GetFullCourseForLearner";
import { IGetFullCourseForLearnerUseCase } from "@application/IUseCases/course/IGetFullCourseForLearner";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";
import { MESSAGES } from "shared/constants/messages";

export class GetFullCourseForLearnerUseCase implements IGetFullCourseForLearnerUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IFileStorageService,
        private _progressRepository: ILearnerProgressRepository
    ) { }

    async execute({ courseId, learnerId }: { courseId: string; learnerId: string }): Promise<GetFullCourseForLearnerOutput> {
        console.log("courseId", courseId);

        const course = await this._courseRepository.findHydratedCourseById(courseId);
        console.log("course", course);
        if (!course) {
            throw new AppError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.BAD_REQUEST)
        }
        const progress = await this._progressRepository.findByLearnerAndCourseAndUpdate(
            learnerId,
            courseId,
            { lastAccessedAt: new Date() }
        );

        if (!progress) {
            throw new AppError(MESSAGES.PROGRESS_NOT_FOUND,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        const currentChapterId = progress.currentChapterId || course.modules[0].chapters[0].id;

        const thumbnail = course.thumbnail
            ? await this._fileStorageService.getViewURL(course.thumbnail)
            : null;
        const previewVideo = course.previewVideo
            ? await this._fileStorageService.getViewURL(course.previewVideo)
            : null;
        console.log(thumbnail, previewVideo);
        const responseModules = course.modules.map((module) => ({
            id: module.id,
            title: module.title,
            description: module.description,
            duration: module.duration,
            chapters: module.chapters.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                description: chapter.description,
                duration: chapter.duration,
                resources: chapter.resources,
            }))
        }))



        return {
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail,
            previewVideo,
            prerequisites: course.prerequisites,
            category: {
                id: course.category.id,
                name: course.category.name,
            },
            enrollmentCount: course.enrollmentCount,
            instructor: {
                id: course.instructor.id,
                name: course.instructor.name,
                profilePic: course.instructor.profilePic
            },
            modules: responseModules,
            whatYouWillLearn: course.whatYouWillLearn,
            price: course.price,
            level: course.level,
            duration: course.duration,
            tags: course.tags,
            rating: course.rating,
            totalRatings: course.totalRatings,
            publishedAt: course.publishedAt,
            totalChapters: course.totalChapters,
            completedChapters: progress.completedChapters,
            progressPercentage: progress.progressPercentage,
            currentChapterId: currentChapterId,
            quizStatus: progress.quizAttemptStatus
        };

    }
}