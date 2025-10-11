import axios from "axios";
import { IGoogleAuthService } from "@domain/interfaces/IGoogleAuthService";
import { logger } from "@infrastructure/logging/Logger";
import { AppError } from "shared/errors/AppError";
import { STATUS_CODES } from "shared/constants/httpStatus";

export class GoogleAuthService implements IGoogleAuthService {
    constructor(
        private _googleApiUrl = process.env.GOOGLE_API_URL || ''
    ) { }


    async getUserInfo(accessToken: string) {

        const res = await axios.get(this._googleApiUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if(!res){
            logger.warn("Failed to fetch user details via google signin api.");
            throw new AppError('Failed to fetch user details via google signin api.',STATUS_CODES.SERVICE_UNAVAILABLE,false)
        }
        logger.info("Accessed used data from google signin api.");
        const { sub, email, name, picture } = res.data;
        return { sub, email, name, picture };

    }

}
