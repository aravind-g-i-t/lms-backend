import { GetCoursesForAdminInput, GetCoursesForAdminOutput } from "@application/dtos/course/GetCoursesForAdmin";

export interface IGetCoursesForAdminUseCase{
    execute(input:GetCoursesForAdminInput):Promise<GetCoursesForAdminOutput>
}