import { LearnerController } from "@presentation/controllers/LearnerController";

import { GetLearnersUseCase } from "@application/useCases/learner/GetLearners";
import { learnerRepository } from "./learnerRepository";
import { UpdateLearnerStatusUseCase } from "@application/useCases/learner/UpdateLearnerStatus";
import { UpdateLearnerProfileUseCase } from "@application/useCases/learner/UpdateProfile";
import { UpdateLearnerPasswordUseCase } from "@application/useCases/learner/UpdatePassword";

const getLearnersUseCase=new GetLearnersUseCase(learnerRepository)

const updateLearnerStatusUseCase=new UpdateLearnerStatusUseCase(learnerRepository)

const updateLearnerProfileUseCase=new UpdateLearnerProfileUseCase(learnerRepository);

const updateLearnerPasswordUseCase=new UpdateLearnerPasswordUseCase(learnerRepository)

export const learnerController= new LearnerController(
    getLearnersUseCase,
    updateLearnerStatusUseCase,
    updateLearnerProfileUseCase,
    updateLearnerPasswordUseCase
);