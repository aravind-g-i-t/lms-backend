import { GetValidCouponsOutput } from "@application/dtos/coupon/GetValidCoupons";
import { CourseForCheckout } from "@application/dtos/course/CourseDTO";
import { IGetValidCouponsUseCase } from "@application/IUseCases/coupon/IGetValidCoupons";
import { IGetCourseDetailsForCheckoutUseCase } from "@application/IUseCases/course/IGetCourseForCheckout";
import { HydratedCourse, ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class GetCourseDetailsForCheckoutUseCase implements IGetCourseDetailsForCheckoutUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IS3Service,
        private _getValidCouponsUseCase:IGetValidCouponsUseCase
    ) { }
    async execute(id: string): Promise<{course:CourseForCheckout, coupons:GetValidCouponsOutput}> {

        const course = await this._courseRepository.findHydratedCourseById(id);
        if (!course) {
            throw new AppError("Failed to fetch course details.", STATUS_CODES.BAD_REQUEST)
        }
        const thumbnail = course.thumbnail
            ? await this._fileStorageService.getDownloadUrl(course.thumbnail)
            : null;
        const profilePic = course.instructor?.profilePic ? await this._fileStorageService.getDownloadUrl(course.instructor.profilePic) : null;
        
        
        const mappedCourse= this._toCourseDetails({ ...course, thumbnail,instructor: { ...course.instructor, profilePic} });

        const coupons=await this._getValidCouponsUseCase.execute({
            amount:course.price
        })
        return {
            course:mappedCourse,
            coupons
        }
    }

    private _toCourseDetails(input: HydratedCourse): CourseForCheckout {
        return {
            id: input.id,
            title: input.title,
            description: input.description,
            thumbnail: input.thumbnail as string,
            instructor: {
                id: input.instructor.id,
                name: input.instructor.name,
                profilePic: input.instructor.profilePic as string
            },
            price: input.price,
        }
    }
}