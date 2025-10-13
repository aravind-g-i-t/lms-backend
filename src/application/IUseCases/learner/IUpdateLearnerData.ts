import { LearnerAsRaw } from "@application/dtos/learner/LearnerDTO";


export interface IUpdateLearnerDataUseCase{
    execute(id:string,update:Partial<LearnerAsRaw>):Promise<void>
}