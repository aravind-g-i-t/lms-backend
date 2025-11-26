import { CourseForLearnerListing } from "@application/dtos/course/CourseDTO";
import { GetCoursesForLearnerOutput } from "@application/dtos/course/GetCourseForLearners";
import { IGetCoursesForLearnerUseCase } from "@application/IUseCases/course/IGetCoursesForLearner";
import { Course, CourseLevel } from "@domain/entities/Course";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";

const sortMapper = {
    latest: { createdAt: "desc" },
    rating: { rating: "desc" },
    popularity: { enrollmentCount: "desc" },
    price_low: { price: "asc" },
    price_high: { price: "desc" }
}

type Sort = "latest" | "rating" | "popularity" | "price_low" | "price_high"

export class GetCoursesForLearnerUseCase implements IGetCoursesForLearnerUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IS3Service
    ) { }

    async execute(input: { page?: number, limit: number, search?: string; sort: Sort; instructorIds?: string[]; categoryIds?: string[]; levels?: string[]; durationRange?: [number, number]; priceRange?: [number, number]; minRating?: number; }): Promise<GetCoursesForLearnerOutput> {


        const { page, limit, search, sort, instructorIds, categoryIds, levels, durationRange, priceRange, minRating } = input;
        const result = await this._courseRepository.findAllCourses({
            pagination: {
                page,
                limit
            },
            search,
            sort: sortMapper[sort] as Record<keyof Course, "asc" | "desc">,
            filter: {
                instructorIds,
                categoryIds,
                levels: levels as CourseLevel[],
                durationRange,
                priceRange,
                minRating
            }
        });



        const courses = await Promise.all(
            result.courses.map(async (course) => {
                const thumbnailURL = course.thumbnail
                    ? await this._fileStorageService.getDownloadUrl(course.thumbnail)
                    : null;


                return this._toGetCourseForLearner({
                    ...course,
                    thumbnail: thumbnailURL,
                });
            })
        );


        return { pagination: result.pagination, courses };
    }

    private _toGetCourseForLearner(doc: HydratedCourse): CourseForLearnerListing {
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
        }
    }
}