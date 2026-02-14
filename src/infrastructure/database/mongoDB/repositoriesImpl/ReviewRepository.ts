import { Review } from "@domain/entities/Review";
import { BaseRepository } from "./BaseRepository";
import { ReviewModel } from "../models/ReviewModel";
import { ReviewMapper } from "../mappers/ReviewMapper";
import { HydratedReview, IReviewRepository, } from "@domain/interfaces/IReviewRepository";
import { LearnerDoc } from "../models/LearnerModel";
import { FilterQuery, Types } from "mongoose";


export class ReviewRepository extends BaseRepository<Review> implements IReviewRepository {
    constructor() {
        super(ReviewModel, ReviewMapper)
    }

    async findManyWithPagination({ skip, limit, courseId, learnerId }: { skip: number; limit: number; courseId: string; learnerId?: string }): Promise<HydratedReview[]> {

        const filter:FilterQuery<Review>={
            courseId,
            isVisible:true
        }
        if(learnerId){
            filter.learnerId={$ne:learnerId}
        }
        
        const docs = await ReviewModel
            .find(filter)
            .populate<{ categoryId: LearnerDoc }>("learnerId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        return docs.map(doc => this.mapper.toHydratedDomain(doc))
    }

    async getRatingSum(courseId: string): Promise<number> {
        const result = await this.model.aggregate([
            { $match: { courseId: new Types.ObjectId(courseId), isVisible: true } },
            { $group: { _id: null, total: { $sum: "$rating" } } }
        ]);

        return result[0]?.total ?? 0;
    }
}