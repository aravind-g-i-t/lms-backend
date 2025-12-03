import { Favourite } from "@domain/entities/Favourite";
import { FavouriteDoc } from "../models/FavouriteModel";

export class FavouriteMapper {
    static toDomain(doc: FavouriteDoc): Favourite {
        return {
            id: doc._id.toString(),
            learnerId: doc.learnerId.toString(),
            courseId: doc.courseId.toString(),
            createdAt: doc.createdAt
        };
    }
}
