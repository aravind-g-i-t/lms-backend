import { CourseForInstructorListing } from "@application/dtos/course/CourseDTO";
import { GetCoursesForInstructorsInput, GetCoursesForInstructorsOutput } from "@application/dtos/course/GetCourseForInstructors";
import { IGetCoursesForInstructorUseCase } from "@application/IUseCases/course/IGetCoursesForInstructor";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { escapeRegExp } from "shared/utils/escapeRegExp";

type CourseQuery = {
    instructorId?: string;
    title?: { $regex: string; $options: string };
    "verification.status"?: string;
    status?: "published" | "draft" | "under_review" | "archived";
};

export class GetCoursesForInstructorUseCase implements IGetCoursesForInstructorUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IS3Service
    ) { }
    async execute(input: GetCoursesForInstructorsInput): Promise<GetCoursesForInstructorsOutput> {
        const { page, search, limit, instructorId, status } = input;

        const query: CourseQuery = {};
        query.instructorId = instructorId
        if (search?.trim()) {
            query.title = {
                $regex: escapeRegExp(search.trim()).slice(0, 100),
                $options: "i",
            };
        }
        if (status) {
            query.status = status;
        }

        const result = await this._courseRepository.findAll({
            filter: query,
            pageOptions: {
                page,
                limit
            },
            sort: {
                createdAt: -1
            }
        });
        const { pagination } = result;

        const courses = await Promise.all(
            result.courses.map(async (course) => {
                const thumbnailURL = course.thumbnail
                    ? await this._fileStorageService.getDownloadUrl(course.thumbnail)
                    : null;


                return this._toGetCoursesForInstructor({
                    ...course,
                    thumbnail: thumbnailURL,
                });
            })
        );

        return { pagination, courses };
    }

    private _toGetCoursesForInstructor(input: HydratedCourse): CourseForInstructorListing {
        return {
            id: input.id,
            title: input.title,
            enrollmentCount: input.enrollmentCount,
            level: input.level,
            status: input.status,
            duration: input.duration,
            thumbnail: input.thumbnail,
            price: input.price,
            rating: input.rating,
            createdAt: input.createdAt,
            verification: {
                status: input.verification.status
            }
        }
    }
}