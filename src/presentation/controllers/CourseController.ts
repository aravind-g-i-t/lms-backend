import { IAddChapterUseCase } from "@application/IUseCases/course/IAddChapter";
import { IAddModuleUseCase } from "@application/IUseCases/course/IAddModule";
import { IAddResourceUseCase } from "@application/IUseCases/course/IAddResource";
import { ICreateCourseUseCase } from "@application/IUseCases/course/ICreateCourse";
import { IDeleteChaperUseCase } from "@application/IUseCases/course/IDeleteChapter";
import { IDeleteModuleUseCase } from "@application/IUseCases/course/IDeleteModule";
import { IDeleteResourceUseCase } from "@application/IUseCases/course/IDeleteResource";
import { IGetCourseDetailsUseCase } from "@application/IUseCases/course/IGetCourseDetails";
import { IGetCourseDetailsForLearnerUseCase } from "@application/IUseCases/course/IGetCourseDetailsForLearner";
import { IGetCourseDetailsForCheckoutUseCase } from "@application/IUseCases/course/IGetCourseForCheckout";
import { IGetCoursesForAdminUseCase } from "@application/IUseCases/course/IGetCoursesForAdmin";
import { IGetCoursesForInstructorUseCase } from "@application/IUseCases/course/IGetCoursesForInstructor";
import { IGetCoursesForLearnerUseCase } from "@application/IUseCases/course/IGetCoursesForLearner";
import { IGetFullCourseForLearnerUseCase } from "@application/IUseCases/course/IGetFullCourseForLearner";
import { ISubmitCourseForReviewUseCase } from "@application/IUseCases/course/ISubmitForReview";
import { IUpdateChapterInfoUseCase } from "@application/IUseCases/course/IUpdateChapterInfo";
import { IUpdateChapterVideoUseCase } from "@application/IUseCases/course/IUpdateChapterVideo";
import { IUpdateCourseUseCase } from "@application/IUseCases/course/IUpdateCourse";
import { IUpdateModuleInfoUseCase } from "@application/IUseCases/course/IUpdateModuleInfo";
import { IUpdateCourseStatusUseCase } from "@application/IUseCases/course/IUpdateStatus";
import { IUpdateCourseVerificationUseCase } from "@application/IUseCases/course/IUpdateVerification";
import { IGetFavouritesUseCase } from "@application/IUseCases/favourite/IGetFavourites";
import { GetCourseDeatailsForLearnerRequestSchema } from "@presentation/dtos/course/GetCourseDetailsForLearner";
import { GetCoursesForAdminRequestSchema } from "@presentation/dtos/course/GetCoursesForAdmin";
import { GetCoursesForInstructorRequestSchema } from "@presentation/dtos/course/GetCoursesForInstructor";
import { GetCoursesForLearnerRequestSchema } from "@presentation/dtos/course/GetCoursesForLearner";
import { GetFavouritesRequestSchema } from "@presentation/dtos/course/GetFavourites";
import { AuthenticatedRequest } from "@presentation/middlewares/createAuthMiddleware";
import { NextFunction, Response } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";


export class CourseController {
    constructor(
        private _createCourseUseCase: ICreateCourseUseCase,
        private _getCoursesForInstructorUseCase: IGetCoursesForInstructorUseCase,
        private _getCourseDetailsUseCase: IGetCourseDetailsUseCase,
        private _updateCourseUseCase: IUpdateCourseUseCase,
        private _addModuleUseCase: IAddModuleUseCase,
        private _addChapterUseCase: IAddChapterUseCase,
        private _updateChapterUseCase: IUpdateChapterInfoUseCase,
        private _updateVideoUseCase: IUpdateChapterVideoUseCase,
        private _updateModuleUseCase: IUpdateModuleInfoUseCase,
        private _deleteModuleUseCase: IDeleteModuleUseCase,
        private _deleteChapterUseCase: IDeleteChaperUseCase,
        private _submitCourseForReviewUseCase: ISubmitCourseForReviewUseCase,
        private _updateVerificationUseCase: IUpdateCourseVerificationUseCase,
        private _getCoursesForAdminUseCase: IGetCoursesForAdminUseCase,
        private _updateCourseStatusUseCase: IUpdateCourseStatusUseCase,
        private _getCoursesForLearnerUseCase: IGetCoursesForLearnerUseCase,
        private _getCoureDetailsForLearnerUseCase: IGetCourseDetailsForLearnerUseCase,
        private _getFullCourseForLearnerUseCase: IGetFullCourseForLearnerUseCase,
        private _getCourseDetailsForCheckoutUseCase:IGetCourseDetailsForCheckoutUseCase,
        private _addResourceUseCase: IAddResourceUseCase,
        private _deleteResourceUseCase: IDeleteResourceUseCase,
        private _getFavouritesUseCase: IGetFavouritesUseCase
    ) { }

    async createCourse(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, description, prerequisites, categoryId, price, level, tags, whatYouWillLearn } = req.body;
            const instructorId = req.user?.id
            if (!instructorId) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const courseId = await this._createCourseUseCase.execute({
                instructorId,
                title,
                description,
                prerequisites,
                categoryId,
                price,
                level,
                tags,
                whatYouWillLearn
            });
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: { courseId }
            });

        } catch (error) {
            next(error)
        }
    }

    async getCoursesForInstructor(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = GetCoursesForInstructorRequestSchema.parse(req);


            const { page, limit, search, status } = query;
            const instructorId = req.user?.id
            if (!instructorId) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            const response = await this._getCoursesForInstructorUseCase.execute({
                page,
                limit,
                search,
                status,
                instructorId
            });
            res.status(201).json({
                success: true,
                message: "Courses fetched successfully",
                data: response
            });

        } catch (error) {
            next(error)
        }
    }

    async getCourseDetails(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.query;
            const response = await this._getCourseDetailsUseCase.execute(id as string);
            res.status(201).json({
                success: true,
                message: "Course details fetched successfully",
                data: response
            });

        } catch (error) {
            next(error)
        }
    }

    async updateCourseInfo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id, title, description, categoryId, level, price } = req.body;
            await this._updateCourseUseCase.execute(id, { title, description, categoryId, level, price });
            res.status(201).json({
                success: true,
                message: "Course details updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async updateThumbnail(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id, thumbnail } = req.body;
            await this._updateCourseUseCase.execute(id, { thumbnail });
            res.status(201).json({
                success: true,
                message: "Course thumbnail updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async updatePreviewVideo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id, previewVideo } = req.body;
            await this._updateCourseUseCase.execute(id, { previewVideo });
            res.status(201).json({
                success: true,
                message: "Course preview video updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async updateWhatYouWillLearn(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id, whatYouWillLearn } = req.body;
            await this._updateCourseUseCase.execute(id, { whatYouWillLearn });
            res.status(201).json({
                success: true,
                message: "Course preview video updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async updatePrerequisites(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id, prerequisites } = req.body;
            await this._updateCourseUseCase.execute(id, { prerequisites });
            res.status(201).json({
                success: true,
                message: "Course preview video updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async updateTags(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id, tags } = req.body;
            await this._updateCourseUseCase.execute(id, { tags });
            res.status(201).json({
                success: true,
                message: "Course tags updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async addModule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id, title, description } = req.body;
            const result = await this._addModuleUseCase.execute(id, { title, description });
            res.status(201).json({
                success: true,
                message: "Module added successfully",
                module: result
            });

        } catch (error) {
            next(error)
        }
    }

    async addChapter(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId, title, description, video, duration } = req.body;
            const chapter = {
                title, description, video, duration
            }
            const result = await this._addChapterUseCase.execute(courseId, moduleId, chapter);
            res.status(201).json({
                success: true,
                message: "Chapter added successfully",
                chapter: result
            });

        } catch (error) {
            next(error)
        }
    }

    async updateChapter(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId, title, description, chapterId }: { courseId: string; moduleId: string; title: string; description: string; chapterId: string } = req.body;

            await this._updateChapterUseCase.execute({ courseId, chapterId, moduleId, title, description });
            res.status(201).json({
                success: true,
                message: "Chapter updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async updateVideo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId, video, duration, chapterId }: { courseId: string; moduleId: string; video: string; duration: number; chapterId: string } = req.body;

            await this._updateVideoUseCase.execute({
                courseId, moduleId, chapterId, video, duration
            });
            res.status(201).json({
                success: true,
                message: "Video updated successfully."
            });

        } catch (error) {
            next(error)
        }
    }

    async updateModule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId, title, description } = req.body;
            await this._updateModuleUseCase.execute({
                courseId, moduleId, title, description
            });
            res.status(201).json({
                success: true,
                message: "Module updated successfully.",
            });

        } catch (error) {
            next(error)
        }
    }

    async deleteChapter(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId, chapterId } = req.body;
            await this._deleteChapterUseCase.execute({
                courseId, moduleId, chapterId
            });
            res.status(201).json({
                success: true,
                message: "Chapter deleted successfully.",
            });

        } catch (error) {
            next(error)
        }
    }

    async deleteModule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId } = req.body;

            await this._deleteModuleUseCase.execute({
                courseId,
                moduleId
            });
            res.status(201).json({
                success: true,
                message: "Module deleted successfully.",
            });

        } catch (error) {
            next(error)
        }
    }

    async submitForReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId } = req.body;

            await this._submitCourseForReviewUseCase.execute(courseId);
            res.status(201).json({
                success: true,
                message: "Course submitted for review successfully.",
            });

        } catch (error) {
            next(error)
        }
    }

    async updateVerification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, status, remarks } = req.body;

            const verification = await this._updateVerificationUseCase.execute({ courseId, status, remarks });
            res.status(201).json({
                success: true,
                message: "Course verification updated successfully.",
                verification
            });

        } catch (error) {
            next(error)
        }
    }

    async getCoursesForAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = GetCoursesForAdminRequestSchema.parse(req);


            const { page, limit, search, status, verificationStatus } = query;

            const response = await this._getCoursesForAdminUseCase.execute({
                page,
                limit,
                search,
                status,
                verificationStatus
            });
            res.status(201).json({
                success: true,
                message: "Courses fetched successfully",
                pagination: response.pagination,
                courses: response.courses
            });

        } catch (error) {
            next(error)
        }
    }

    async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, status } = req.body;

            const verification = await this._updateCourseStatusUseCase.execute({ courseId, status });
            res.status(201).json({
                success: true,
                message: "Course status updated successfully.",
                verification
            });

        } catch (error) {
            next(error)
        }
    }


    async getCoursesForLearner(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = GetCoursesForLearnerRequestSchema.parse(req);

            const {
                page,
                limit,
                search,
                sort,
                learnerId,
                // Renamed from 'categoryIds[]'
                'categoryIds[]': categoryIds,
                'instructorIds[]': instructorIds,
                'priceRange[]': priceRange,
                'levels[]': levels,
                "durationRange[]": durationRange,
                minRating
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } = query as any


            const response = await this._getCoursesForLearnerUseCase.execute({
                page,
                limit,
                search,
                sort,
                instructorIds: instructorIds,
                categoryIds: categoryIds,
                priceRange,
                levels,
                durationRange,
                minRating,
                learnerId
            });

            res.status(201).json({
                success: true,
                message: "Courses fetched successfully",
                pagination: response.pagination,
                courses: response.courses
            });

        } catch (error) {
            next(error);
        }
    }

    async getFullCourseForLearner(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const { courseId } = req.query;
            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError("Failed to access user details", STATUS_CODES.NOT_FOUND)
            }
            console.log(learnerId,courseId)
            const response = await this._getFullCourseForLearnerUseCase.execute({
                courseId:courseId as string,
                learnerId
            });

            res.status(201).json({
                success: true,
                message: "Course fetched successfully",
                data: response
            });

        } catch (error) {
            next(error)
        }
    }

    async getCourseDetailsForLearner(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = GetCourseDeatailsForLearnerRequestSchema.parse(req);
            const { courseId, learnerId } = query;
            const response = await this._getCoureDetailsForLearnerUseCase.execute({
                courseId,
                learnerId
            });

            res.status(201).json({
                success: true,
                message: "Course details fetched successfully",
                data: response
            });

        } catch (error) {
            next(error)
        }
    }

    async getCourseDetailsForCheckout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const courseId= req.query.courseId as string;

            const response = await this._getCourseDetailsForCheckoutUseCase.execute(courseId);

            res.status(201).json({
                success: true,
                message: "Course details fetched successfully",
                data: response
            });

        } catch (error) {
            next(error)
        }
    }

    async addResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId, chapterId, name, file, size } = req.body;

            const result = await this._addResourceUseCase.execute({
                courseId,
                moduleId,
                chapterId,
                resource:{
                    name,
                    file,
                    size
                }
            });
            res.status(201).json({
                success: true,
                message: "Chapter added successfully",
                resource: result
            });

        } catch (error) {
            next(error)
        }
    }

    async deleteResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const { courseId, moduleId, chapterId, resourceId } = req.body;

            await this._deleteResourceUseCase.execute({
                courseId,
                moduleId,
                chapterId,
                resourceId
            });
            res.status(201).json({
                success: true,
                message: "Chapter deleted successfully",
            });

        } catch (error) {
            next(error)
        }
    }

    async getFavourites(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = GetFavouritesRequestSchema.parse(req);

            const {
                page,
                limit,
                search,
            } = query 

            const learnerId = req.user?.id
            if (!learnerId) {
                throw new AppError("Failed to access user details", STATUS_CODES.NOT_FOUND)
            }

            const response = await this._getFavouritesUseCase.execute({
                page,
                limit,
                search,
                learnerId
            });

            res.status(201).json({
                success: true,
                message: "Courses fetched successfully",
                pagination: response.pagination,
                courses: response.courses
            });

        } catch (error) {
            next(error);
        }
    }

}

