import { IAddtoFavouritesUseCase } from "@application/IUseCases/favourite/IAddToFavourites";
import { IFavouriteRepository } from "@domain/interfaces/IFavouriteRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class AddToFavouritesUseCase implements IAddtoFavouritesUseCase{
    constructor(
        private _favouriteRepository:IFavouriteRepository
    ){}

    async execute(input: { courseId: string; learnerId: string; }): Promise<void> {
        const {courseId,learnerId}=input;
        console.log("input",input);
        
        const exists = await this._favouriteRepository.exists({
            courseId,
            learnerId
        })
        console.log(exists);
        
        if(exists){
            return;
        }
        const created = await this._favouriteRepository.create({
            courseId,
            learnerId
        })
        console.log(created);
        
        if(!created){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}