import { Favourite } from "../entities/Favourite";
import { IBaseRepository } from "./IBaseRepository";

export interface IFavouriteRepository extends IBaseRepository<Favourite> {
    remove(input:{learnerId: string, courseId: string}): Promise<void>;
    exists(input:{learnerId: string, courseId: string}): Promise<boolean>;
    getFavouriteCourseIdsByLearner(learnerId: string): Promise<string[]>;
}