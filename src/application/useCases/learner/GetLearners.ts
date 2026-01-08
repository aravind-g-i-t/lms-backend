
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { IGetLearnersUseCase } from "@application/IUseCases/learner/IGetLearners";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { GetLearnersInput, GetLearnersOutput } from "@application/dtos/learner/GetLearners";
import { LearnerDTOMapper } from "@application/mappers/LearnerMapper";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";

type LearnerQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
};

export class GetLearnersUseCase implements IGetLearnersUseCase {
    constructor(
        private _learnerRepository: ILearnerRepository,
        private _fileStorageService: IFileStorageService 
    ) {}

    async execute(input: GetLearnersInput): Promise<GetLearnersOutput> {
        const { page, search, status, limit } = input;
                
        const query: LearnerQuery = {};
        if (status) query.isActive = status === "Active";
        if (search?.trim()) {
            query.name = { $regex: escapeRegExp(search.trim()).slice(0, 100), $options: "i" };
        }

        const result = await this._learnerRepository.findAll(query, { page, limit });
        const { totalPages, totalCount } = result;

        
        const learners = await Promise.all(
            result.learners.map(async learner => {
                
                if (learner.profilePic) {
                    learner.profilePic = await this._fileStorageService.getDownloadUrl(learner.profilePic);
                }
                return LearnerDTOMapper.toGetLearnersDTO(learner);
            })
        );

        return { learners, totalPages, totalCount };
    }
}
