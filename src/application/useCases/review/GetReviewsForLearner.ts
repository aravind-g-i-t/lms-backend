import { MyReviewForLIsting, ReviewForLearnerListing } from "@application/dtos/review/ReviewForLearnerListing";
import { IGetReviewsForLearnerUseCase } from "@application/IUseCases/review/IGetReviewsForLearner";
import { ReviewDTOMapper } from "@application/mappers/ReviewDTOMapper";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { IReviewRepository } from "@domain/interfaces/IReviewRepository";

export class GetReviewsForLearnerUseCase implements IGetReviewsForLearnerUseCase{
    constructor(
        private _reviewRepository:IReviewRepository,
        private _fileStorageService:IFileStorageService,
    ){}

    async execute(input:{courseId:string; learnerId?:string; skip:number; limit:number}):Promise<{myReview:MyReviewForLIsting|null; reviews:ReviewForLearnerListing[]}>{
        const {courseId,learnerId,skip,limit}= input

        let myReview;

        if(learnerId){
            myReview= await this._reviewRepository.findOne({
            courseId,
            learnerId
        });
        }
         
        const reviews= await this._reviewRepository.findManyWithPagination({
            skip,
            limit,
            courseId,
            learnerId
        });

        const mappedReviews= await Promise.all(
            reviews.map(async (review)=>{
                const profilePic= review.learner.profilePic?await this._fileStorageService.getViewURL(review.learner.profilePic) : null;
                return ReviewDTOMapper.toListing({...review,learner:{...review.learner,profilePic}});

            })
        );
        let myReviewForLIsting=null;
        if(myReview){
            myReviewForLIsting={
                id:myReview.id,
                rating:myReview.rating,
                reviewText:myReview.reviewText,
                createdAt:myReview.createdAt,
                isEdited:myReview.isEdited
            }
        }

        return {
            myReview:myReviewForLIsting,
            reviews:mappedReviews
        }
        
    }
}