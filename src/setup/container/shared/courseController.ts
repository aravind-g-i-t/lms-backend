import { CreateCourseUseCase } from "@application/useCases/course/CreateCourse";
import {  GetCoursesForInstructorUseCase } from "@application/useCases/course/GetCoursesForInstructor";
import { CourseRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/CourseRepository";
import { CourseController } from "@presentation/controllers/CourseController";
import { s3Service } from "./s3Controller";
import { GetCourseDetailsUseCase } from "@application/useCases/course/GetCourseDetails";
import { UpdateCourseUseCase } from "@application/useCases/course/UpdateCourseInfo";
import { AddModuleUseCase } from "@application/useCases/course/AddModule";
import { AddChapterUseCase } from "@application/useCases/course/AddChapter";
import { UpdateChapterInfoUseCase } from "@application/useCases/course/UpdateChapterInfo";
import { UpdateChapterVideoUseCase } from "@application/useCases/course/UpdateChapterVideo";
import { UpdateModuleInfoUseCase } from "@application/useCases/course/UpdateModuleInfo";
import { DeleteChapterUseCase } from "@application/useCases/course/DeleteChapter";
import { DeleteModuleUseCase } from "@application/useCases/course/DeleteModule";
import { SubmitCourseForReviewUseCase } from "@application/useCases/course/SubmitForReview";
import { UpdateCourseVerificationUseCase } from "@application/useCases/course/UpdateVerification";
import { GetCoursesForAdminUseCase } from "@application/useCases/course/GetCoursesForAdmin";
import { UpdateCourseStatusUseCase } from "@application/useCases/course/UpdateStatus";
import { GetCoursesForLearnerUseCase } from "@application/useCases/course/GetCoursesForLearner";
import { GetCourseDetailsForLearnerUseCase } from "@application/useCases/course/GetCourseDetailsForLearner";
import { instructorRepository } from "../instructor/instructorRepository";
import { enrollmentRepository, learnerProgressRepository } from "./dependencies";
import { GetFullCourseForLearnerUseCase } from "@application/useCases/course/GetFullCourseForLearner";
import { GetCourseDetailsForCheckoutUseCase } from "@application/useCases/course/GetCourseForCheckout";
import { DeleteResourceUseCase } from "@application/useCases/course/DeleteResource";
import { AddResourceUseCase } from "@application/useCases/course/AddResource";
import { favouriteRepository } from "../learner/learnerRepository";
import { GetFavouritesUseCase } from "@application/useCases/favourite/GetFavourites";
import { getValidCouponsUseCase } from "../coupon";

export const courseRepository= new CourseRepository();

const createCourseUseCase=new CreateCourseUseCase(courseRepository,instructorRepository)

const getCourseDetailsUseCase= new GetCourseDetailsUseCase(courseRepository,s3Service)

const updateCourseUseCase= new UpdateCourseUseCase(courseRepository)

const getCoursesForInstructorUseCase= new GetCoursesForInstructorUseCase(courseRepository,s3Service)

const addModuleUseCase=new AddModuleUseCase(courseRepository)

const addChapterUseCase = new AddChapterUseCase(courseRepository,s3Service);

const updateChapterUseCase=  new UpdateChapterInfoUseCase(courseRepository);

const updateVideoUseCase= new UpdateChapterVideoUseCase(courseRepository);

const updateModuleUseCase = new UpdateModuleInfoUseCase(courseRepository);

const deleteChapterUseCase = new DeleteChapterUseCase(courseRepository);

const deleteModuleUseCase = new DeleteModuleUseCase(courseRepository);

const submitCourseForReviewUseCase = new SubmitCourseForReviewUseCase(courseRepository,instructorRepository);

const updateCourseVerificationUseCase = new UpdateCourseVerificationUseCase(courseRepository);

const getCoursesForAdminUseCase= new GetCoursesForAdminUseCase(courseRepository,s3Service);

const updateCourseStatusUseCase = new UpdateCourseStatusUseCase(courseRepository)

const getCoursesForLearnerUseCase = new GetCoursesForLearnerUseCase(courseRepository,s3Service,favouriteRepository);

const getCourseDetailsForLearner = new GetCourseDetailsForLearnerUseCase(courseRepository,s3Service,enrollmentRepository,favouriteRepository)

const getFullCourseForLearnerUseCase = new GetFullCourseForLearnerUseCase(courseRepository,s3Service,learnerProgressRepository)


const getCourseDetailsForCheckout= new GetCourseDetailsForCheckoutUseCase(courseRepository,s3Service,getValidCouponsUseCase);

const addResourceUseCase = new AddResourceUseCase(courseRepository,s3Service)

const deleteResourceUseCase= new DeleteResourceUseCase(courseRepository);

const getFavouritesUseCase = new GetFavouritesUseCase(courseRepository,s3Service,favouriteRepository)

export const courseController=new CourseController(
    createCourseUseCase,
    getCoursesForInstructorUseCase,
    getCourseDetailsUseCase,
    updateCourseUseCase,
    addModuleUseCase,
    addChapterUseCase,
    updateChapterUseCase,
    updateVideoUseCase,
    updateModuleUseCase,
    deleteModuleUseCase,
    deleteChapterUseCase,
    submitCourseForReviewUseCase,
    updateCourseVerificationUseCase,
    getCoursesForAdminUseCase,
    updateCourseStatusUseCase,
    getCoursesForLearnerUseCase,
    getCourseDetailsForLearner,
    getFullCourseForLearnerUseCase,
    getCourseDetailsForCheckout,
    addResourceUseCase,
    deleteResourceUseCase,
    getFavouritesUseCase
);