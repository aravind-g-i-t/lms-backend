import { CourseForCheckout } from "@application/dtos/course/CourseDTO";

export interface IGetCourseDetailsForCheckoutUseCase{
    execute(courseId:string):Promise<{course:CourseForCheckout}>
}