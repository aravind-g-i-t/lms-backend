import { IRemoveFromFavouritesUseCase } from "@application/IUseCases/favourite/IRemoveFromFavourites";
import { IFavouriteRepository } from "@domain/interfaces/IFavouriteRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class RemoveFromFavouritesUseCase implements IRemoveFromFavouritesUseCase{
    constructor(
        private _favouriteRepository:IFavouriteRepository
    ){}

    async execute(input: { courseId: string; learnerId: string; }): Promise<void> {
        const {courseId,learnerId}=input;
        await this._favouriteRepository.remove({
            courseId,
            learnerId
        })

        const exists= await this._favouriteRepository.exists({
            courseId,
            learnerId
        })
        if(exists){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}