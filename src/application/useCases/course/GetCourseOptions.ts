import { IGetCourseOptionsUseCase } from "@application/IUseCases/course/IGetCourseOptions";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";



export class GetCoursesOptionsUseCase implements IGetCourseOptionsUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
    ) { }
    async execute(input: {instructorId:string}): Promise<{id:string; title:string}[]> {
        const {  instructorId } = input;
        

        const result = await this._courseRepository.findMany({
            instructorId
        });


        return result.map(course=>{
           return {id:course.id,title:course.title}
        });
    }

}