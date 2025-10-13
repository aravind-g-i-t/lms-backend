import { GetLearnerDataOutput } from "@application/dtos/learner/GetLearnerData";

export interface IGetLearnerDataUseCase{
    execute(id:string):Promise<GetLearnerDataOutput>
}