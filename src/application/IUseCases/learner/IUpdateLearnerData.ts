import { Learner } from "@domain/entities/Learner";


export interface IUpdateLearnerDataUseCase{
    execute(id:string,update:Partial<Learner>):Promise<Learner>
}