import { GetCourseDetailsForLearnerOutput } from "@application/dtos/course/GetCourseDetailsForLearner";

export interface IGetCourseDetailsForLearnerUseCase{
    execute(input:{courseId:string,learnerId:string |null}):Promise<GetCourseDetailsForLearnerOutput>
}