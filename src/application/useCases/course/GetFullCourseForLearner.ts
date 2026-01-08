import { GetFullCourseForLearnerOutput } from "@application/dtos/course/GetFullCourseForLearner";
import { IGetFullCourseForLearnerUseCase } from "@application/IUseCases/course/IGetFullCourseForLearner";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

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
            throw new AppError("Failed to fetch course details.", STATUS_CODES.BAD_REQUEST)
        }
        const progress = await this._progressRepository.findByLearnerAndCourseAndUpdate(
            learnerId,
            courseId,
            { lastAccessedAt: new Date() }
        );

        if (!progress) {
            throw new AppError("Failed to get learner progress")
        }
        const currentChapterId = progress.currentChapterId || course.modules[0].chapters[0].id;

        const thumbnail = course.thumbnail
            ? await this._fileStorageService.getDownloadUrl(course.thumbnail)
            : null;
        const previewVideo = course.previewVideo
            ? await this._fileStorageService.getDownloadUrl(course.previewVideo)
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

    // private _toCourseDetails(input: HydratedCourse, progress: LearnerProgress): GetFullCourseForLearnerOutput {
    //     return {
    //         id: input.id,
    //         title: input.title,
    //         description: input.description,
    //         thumbnail: input.thumbnail,
    //         previewVideo: input.previewVideo,
    //         prerequisites: input.prerequisites,
    //         category: {
    //             id: input.category.id,
    //             name: input.category.name,
    //         },
    //         enrollmentCount: input.enrollmentCount,
    //         instructor: {
    //             id: input.instructor.id,
    //             name: input.instructor.name,
    //             profilePic: input.instructor.profilePic
    //         },
    //         modules: input.modules,
    //         whatYouWillLearn: input.whatYouWillLearn,
    //         price: input.price,
    //         level: input.level,
    //         duration: input.duration,
    //         tags: input.tags,
    //         rating: input.rating,
    //         totalRatings: input.totalRatings,
    //         publishedAt: input.publishedAt,
    //         totalChapters: input.totalChapters,
    //         completedChapters: progress.completedChapters,
    //         progressPercentage: progress.progressPercentage,
    //         currentChapterId: progress.currentChapterId,
    //         quizStatus: progress.quizAttemptStatus
    //     }
    // }
}