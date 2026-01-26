import { ICreateCourseUseCase } from "@application/IUseCases/course/ICreateCourse";
import { CourseLevel, CourseStatus, VerificationStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";



export class CreateCourseUseCase implements ICreateCourseUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _instructorRepository: IInstructorRepository,
    
    ) { }

    async execute(input: { instructorId: string, title: string; description: string; prerequisites: string[]; categoryId: string; price: number; level: CourseLevel; tags: string[]; whatYouWillLearn: string[]; }): Promise<string> {


        const instructor = await this._instructorRepository.findById(input.instructorId);
        if (!instructor) {
            throw new AppError("Failed to fetch instructor for verification", STATUS_CODES.BAD_REQUEST)
        }
        // if (instructor.verification.status !== "Verified") {
        //     throw new AppError("Please verify your profile before submitting course for review.")
        // }
        // const today= new Date().getDay();
        // const sameCategoryCourses= await this._courseRepository.findMany({categoryId:input.categoryId});
        // let count=0;
        // for(let i=0;i<sameCategoryCourses.length;i++){
        //     const createdDay= new Date(sameCategoryCourses[i].createdAt).getDay;
        //     if(createdDay===today){

        //     }
        // }

        const course = await this._courseRepository.create({
            instructorId: input.instructorId,
            title: input.title,
            description: input.description,
            prerequisites: input.prerequisites,
            categoryId: input.categoryId,
            price: input.price,
            level: input.level,
            tags: input.tags,
            whatYouWillLearn: input.whatYouWillLearn,
            enrollmentCount: 0,
            modules: [],
            duration: 0,
            totalChapters:0,
            totalModules:0,
            totalRatings: 0,
            status: CourseStatus.Draft,
            rating: null,
            publishedAt: null,
            verification: {
                reviewedAt: null,
                submittedAt: null,
                status: VerificationStatus.NotVerified,
                remarks: null
            },
            thumbnail: null,
            previewVideo: null
        });

        if (!course) {
            throw new AppError("Failed to create course.", STATUS_CODES.BAD_REQUEST)
        }
        return course.id;
    }
}