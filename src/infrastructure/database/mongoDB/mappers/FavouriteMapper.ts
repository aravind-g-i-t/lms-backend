import { Favourite } from "@domain/entities/Favourite";
import { FavouriteDoc } from "../models/FavouriteModel";
import { Types } from "mongoose";

export class FavouriteMapper {
    static toDomain(doc: FavouriteDoc): Favourite {
        return {
            id: doc._id.toString(),
            learnerId: doc.learnerId.toString(),
            courseId: doc.courseId.toString(),
            createdAt: doc.createdAt
        };
    }

    static toPersistence(entity: Partial<Favourite>): Partial<FavouriteDoc> {
        const data: Partial<FavouriteDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.createdAt !== undefined)            data.createdAt = entity.createdAt;
        return data;
    }
}
