import { Favourite } from "../entities/Favourite";

export interface IFavouriteRepository {
    create(input:Partial<Favourite>): Promise<Favourite|null>;
    remove(input:{learnerId: string, courseId: string}): Promise<void>;
    exists(input:{learnerId: string, courseId: string}): Promise<boolean>;
    getFavouriteCourseIdsByLearner(learnerId: string): Promise<string[]>;
}