import { CourseForLearnerListing } from "@application/dtos/course/CourseDTO";
import { GetCoursesForLearnerOutput } from "@application/dtos/course/GetCourseForLearners";
import { IGetFavouritesUseCase } from "@application/IUseCases/favourite/IGetFavourites";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IFavouriteRepository } from "@domain/interfaces/IFavouriteRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";




export class GetFavouritesUseCase implements IGetFavouritesUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IS3Service,
        private _favouriteRepository: IFavouriteRepository
    ) { }

    async execute(input: { page?: number, limit: number, search?: string; learnerId: string }): Promise<GetCoursesForLearnerOutput> {

        console.log(input);

        const { page, limit, search, learnerId } = input;
        const favourites = await this._favouriteRepository.getFavouriteCourseIdsByLearner(learnerId);

        const result = await this._courseRepository.findAllCourses({
            pagination: {
                page,
                limit
            },
            search,
            filter: {
                courseIds: favourites
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
            totalRatings: doc.totalRatings
        }
    }
}