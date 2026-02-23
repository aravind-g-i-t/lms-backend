import { GetInstructorDetailsForLearnerOutputDTO, IGetInstructorDetailsForLearnerUseCase } from "@application/IUseCases/instructor/IGetInstructorDetailsForLearner";
import { CourseStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetInstructorDetailsForLearnerUseCase implements IGetInstructorDetailsForLearnerUseCase {
    constructor(
        private instructorRepo: IInstructorRepository,
        private courseRepo: ICourseRepository,
        private _fileStorageService: IFileStorageService,

    ) { }

    async execute(input: { instructorId: string }): Promise<GetInstructorDetailsForLearnerOutputDTO> {
        const instructor = await this.instructorRepo.findById(input.instructorId);
        if (!instructor) {
            throw new AppError(MESSAGES.INSTRUCTOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        }

        const courses = await this.courseRepo.findMany({ instructorId: input.instructorId, status:CourseStatus.Published});

        const totalCourses = courses.length;
        let totalEnrollments = 0;
        let ratingSum = 0;
        let ratingCount=0
        for (let i = 0; i < totalCourses; i++) {
            totalEnrollments += courses[i].enrollmentCount;
            ratingSum += courses[i].rating || 0;
            ratingCount+=(courses[i].rating)?1:0
        }

        const instructorDetails: GetInstructorDetailsForLearnerOutputDTO["instructor"] = {
            id: instructor.id,
            name: instructor.name,
            email: instructor.email,
            bio: instructor.bio,
            profilePic: await this._fileStorageService.getViewURL(instructor.profilePic as string),
            resume: instructor.resume ? await this._fileStorageService.getViewURL(instructor.resume) : null,
            website: instructor.website,
            expertise: instructor.expertise,
            designation: instructor.designation,
            joiningDate: instructor.joiningDate,
            totalStudents: totalEnrollments,
            totalCourses,
            averageRating: ratingCount > 0 ? ratingSum / ratingCount : null
        };

        console.log(courses);
        

        const outputCourses = await Promise.all(
            courses.map(async (course) => {
                return {
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    enrollmentCount: course.enrollmentCount,
                    instructorId: course.instructorId,
                    level: course.level,
                    duration: course.duration,
                    totalChapters: course.totalChapters,
                    totalModules: course.totalModules,
                    tags: course.tags,
                    price: course.price,
                    rating: course.rating,
                    thumbnail: await this._fileStorageService.getViewURL(course.thumbnail as string),
                    publishedAt: course.publishedAt

                }
            })
        )
        
        return {
            instructor:instructorDetails,
            courses: outputCourses
        };
    }
}