import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import {   IGetBusinessesUseCase } from "@application/IUseCases/business/IGetBusinesses";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";
import { GetBusinessesInput, GetBusinessesOutput } from "@application/dtos/business/GetBusinesses";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";

type BusinessQuery = {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
    "verification.status"?: string;
};

export class GetBusinessesUseCase implements IGetBusinessesUseCase {
    constructor(
        private _businessRepository: IBusinessRepository,
        private _fileStorageService: IFileStorageService
    ) {}

    async execute(input: GetBusinessesInput): Promise<GetBusinessesOutput> {
        const { page, search, status, limit, verificationStatus } = input;

        const query: BusinessQuery = {};
        if (status) {
            query.isActive = status === "Active";
        }
        if (search?.trim()) {
            query.name = {
                $regex: escapeRegExp(search.trim()).slice(0, 100),
                $options: "i",
            };
        }
        if (verificationStatus) {
            query["verification.status"] = verificationStatus;
        }

        const result = await this._businessRepository.findAll(query, { page, limit });
        const { totalPages, totalCount } = result;

        const businesses = await Promise.all(
            result.businesses.map(async (business) => {
                const profilePicUrl = business.profilePic
                    ? await this._fileStorageService.getDownloadUrl(business.profilePic)
                    : null;



                return BusinessDTOMapper.toGetBusinessesDTO({
                    ...business,
                    profilePic: profilePicUrl,
                });
            })
        );

        return { businesses, totalPages, totalCount };
    }
}

