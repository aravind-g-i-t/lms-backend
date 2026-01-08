import { CourseForAdminListing } from "@application/dtos/course/CourseDTO";
import { GetCoursesForAdminInput, GetCoursesForAdminOutput } from "@application/dtos/course/GetCoursesForAdmin";
import { IGetCoursesForAdminUseCase } from "@application/IUseCases/course/IGetCoursesForAdmin";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { escapeRegExp } from "shared/utils/escapeRegExp";

type CourseQuery = {
    title?: { $regex: string; $options: string };
    "verification.status"?: string;
    status?: "published" | "draft" | "under_review" | "archived";
};

export class GetCoursesForAdminUseCase implements IGetCoursesForAdminUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IFileStorageService
    ) { }

    async execute(input: GetCoursesForAdminInput): Promise<GetCoursesForAdminOutput> {
        const { page, search, limit, status, verificationStatus } = input;

        const query: CourseQuery = {};
        if (search?.trim()) {
            query.title = {
                $regex: escapeRegExp(search.trim()).slice(0, 100),
                $options: "i",
            };
        }
        if (status) {
            query.status = status;
        }
        if (verificationStatus) {
            query["verification.status"] = verificationStatus
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


                return this._toGetCoursesForAdmin({
                    ...course,
                    thumbnail: thumbnailURL,
                });
            })
        );

        return { pagination, courses };
    }

    private _toGetCoursesForAdmin(input: HydratedCourse): CourseForAdminListing {
        return {
            id: input.id,
            title: input.title,
            status: input.status,
            thumbnail: input.thumbnail,
            price: input.price,
            verification: {
                status: input.verification.status
            },
            category: {
                name: input.category.name,
                id: input.category.id
            },
            instructor: {
                id: input.instructor.id,
                name: input.instructor.name
            }
        }
    }
}