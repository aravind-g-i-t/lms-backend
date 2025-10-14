import { LearnerController } from "@presentation/controllers/LearnerController";

import { GetLearnersUseCase } from "@application/useCases/learner/GetLearners";
import { learnerRepository } from "./learnerRepository";
import { UpdateLearnerStatusUseCase } from "@application/useCases/learner/UpdateLearnerStatus";

import { UpdateLearnerPasswordUseCase } from "@application/useCases/learner/UpdatePassword";
import { GetLearnerDataUseCase } from "@application/useCases/learner/GetLearnerData";
import { UpdateLearnerDataUseCase } from "@application/useCases/learner/UpdateLearnerData";
import { s3Service } from "../shared/s3Controller";

const getLearnersUseCase=new GetLearnersUseCase(learnerRepository,s3Service)

const updateLearnerStatusUseCase=new UpdateLearnerStatusUseCase(learnerRepository)

const updateLearnerDataUseCase=new UpdateLearnerDataUseCase(learnerRepository);

const updateLearnerPasswordUseCase=new UpdateLearnerPasswordUseCase(learnerRepository)

const getLeanerDataUseCase=new GetLearnerDataUseCase(learnerRepository,s3Service);

export const learnerController= new LearnerController(
    getLearnersUseCase,
    updateLearnerStatusUseCase,
    updateLearnerDataUseCase,
    updateLearnerPasswordUseCase,
    getLeanerDataUseCase
);