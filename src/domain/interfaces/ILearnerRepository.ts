import { Learner } from "@domain/entities/Learner";
import { findAllParams } from "./types";

interface FindAllResponse{
    learners:Learner[],
    totalPages:number,
    totalCount:number,
}

export interface ILearnerRepository{
    create(learner:Partial<Learner>):Promise<Learner>;
    findByEmail(email:string):Promise<Learner | null>;
    findById(id:string):Promise<Learner |null>
    findAll(params: findAllParams):Promise<FindAllResponse>;
    updateStatus(id:string):Promise<void>;
    update(id:string,learner:Partial<Learner>):Promise<Learner|null>
    findOne(params:Partial<Learner>):Promise<Learner|null>;

}