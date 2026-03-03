import { GetValidCouponsOutput } from "@application/dtos/coupon/GetValidCoupons";
import { CourseForCheckout } from "@application/dtos/course/CourseDTO";

export interface IGetCourseDetailsForCheckoutUseCase{
    execute({courseId, learnerId}: {courseId: string, learnerId: string}):Promise<{course:CourseForCheckout,coupons:GetValidCouponsOutput}>
}