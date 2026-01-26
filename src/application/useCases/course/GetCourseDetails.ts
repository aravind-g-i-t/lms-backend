import { GetCourseDetailsOutput } from "@application/dtos/course/GetCourseDetails";
import { IGetCourseDetailsUseCase } from "@application/IUseCases/course/IGetCourseDetails";
import { Quiz } from "@domain/entities/Quiz";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class GetCourseDetailsUseCase implements IGetCourseDetailsUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IFileStorageService,
        private _quizRepository:IQuizRepository
    ) { }
    async execute(id: string): Promise<GetCourseDetailsOutput> {

        const course = await this._courseRepository.findHydratedCourseById(id);
        if (!course) {
            throw new AppError("Failed to fetch course details.", STATUS_CODES.BAD_REQUEST)
        }
        let quiz:Quiz|null=null;
        if(course.quizId){
            quiz= await this._quizRepository.findById(course.quizId);
            if(!quiz){
                throw new AppError("Failed to fetch quiz details.", STATUS_CODES.BAD_REQUEST)
            }
        }
        const thumbnail = course.thumbnail
            ? await this._fileStorageService.getViewURL(course.thumbnail)
            : null;
        const previewVideo = course.previewVideo
            ? await this._fileStorageService.getViewURL(course.previewVideo)
            : null;

        const modules = await Promise.all(
            course.modules.map(async (module) => {
                const updatedChapters = await Promise.all(
                    module.chapters.map(async (chapter) => {
                        if (chapter.video) {
                            const videoUrl = await this._fileStorageService.getViewURL(chapter.video);
                            chapter.video = videoUrl;
                        }
                        return chapter;
                    })
                );
                module.chapters = updatedChapters;
                return module;
            })
        );

        return this._toCourseDetails({ ...course, thumbnail, previewVideo, modules },quiz)
    }

    private _toCourseDetails(input: HydratedCourse,quiz:Quiz|null): GetCourseDetailsOutput {
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
            modules: input.modules,
            whatYouWillLearn: input.whatYouWillLearn,
            price: input.price,
            level: input.level,
            duration: input.duration,
            tags: input.tags,
            rating: input.rating,
            totalRatings: input.totalRatings,
            status: input.status,
            publishedAt: input.publishedAt,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            verification: input.verification,
            quiz:quiz
        }
    }
}