import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import {   IGetBusinessesUseCase } from "@application/IUseCases/business/IGetBusinesses";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";
import { GetBusinessesInput, GetBusinessesOutput } from "@application/dtos/business/GetBusinesses";

type BusinessQuery = {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
    "verification.status"?: string;
};

export class GetBusinessesUseCase implements IGetBusinessesUseCase {
    constructor(private _businessRepository: IBusinessRepository) { }

    async execute(input: GetBusinessesInput): Promise<GetBusinessesOutput> {
        const { page, search, status, limit, verificationStatus } = input;

        const query: BusinessQuery = {};

        if (status) {
            query.isActive = status === "Active";
        }

        if (search?.trim()) {
            query.name = { $regex: escapeRegExp(search.trim()).slice(0, 100), $options: "i" };
        }

        if (verificationStatus) {
            query["verification.status"] = verificationStatus;
        }

        const result = await this._businessRepository.findAll(query, { page, limit });
        const {  totalPages, totalCount } = result;
        const businesses=result.businesses.map(business=>BusinessDTOMapper.toGetBusinessesDTO(business));

        return { businesses, totalPages, totalCount };
    }
}
