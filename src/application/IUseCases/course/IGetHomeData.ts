import { GetLearnerHomeDataOutput } from "@application/dtos/learner/GetLearnerHomeData";

export interface IGetLearnerHomeDataUseCase{
    execute(learnerId:string):Promise<GetLearnerHomeDataOutput>
}