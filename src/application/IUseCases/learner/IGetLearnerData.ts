import { Learner } from "@domain/entities/Learner";

export interface IGetLearnerDataUseCase{
    execute(id:string):Promise<Learner>
}