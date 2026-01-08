import { IFavouriteRepository } from "@domain/interfaces/IFavouriteRepository";
import { Favourite } from "@domain/entities/Favourite";
import { FavouriteModel } from "../models/FavouriteModel";
import { FavouriteMapper } from "../mappers/FavouriteMapper";
import { BaseRepository } from "./BaseRepository";

export class FavouriteRepositoryImpl extends BaseRepository<Favourite> implements IFavouriteRepository {

    constructor(){
        super(FavouriteModel,FavouriteMapper)
    }

    async remove({learnerId,courseId}:{learnerId: string, courseId: string}): Promise<void> {
        await FavouriteModel.deleteOne({ learnerId, courseId });
    }

    async exists({learnerId,courseId}:{learnerId: string, courseId: string}): Promise<boolean> {
        const exists = await FavouriteModel.exists({ learnerId, courseId });
        return !!exists;
    }

    async getFavouriteCourseIdsByLearner(learnerId: string): Promise<string[]> {
        const docs = await FavouriteModel.find({ learnerId },{courseId:1,_id:0}).lean();
        return docs.map(doc=>doc.courseId.toString());
    }
}
