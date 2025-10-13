import { Learner } from "@domain/entities/Learner";
import { FindAllLearnersOutput, FindAllLearnersQuery, FindAllOptions } from "@domain/types";


export interface ILearnerRepository{
    findByEmail(email:string,allowPassword?:boolean):Promise<Learner | null>;

    findOne(params:Partial<Learner>,allowPassword?:boolean):Promise<Learner|null>;

    findById(id:string,allowPassword?:boolean):Promise<Learner |null>

    findAll(
        query:FindAllLearnersQuery, 
        options: FindAllOptions
    ):Promise<FindAllLearnersOutput>;

    create(learner:Partial<Learner>,allowPassword?:boolean):Promise<Learner|null>;

    updateStatus(id:string):Promise<void>;

    findByIdAndUpdate(id:string,learner:Partial<Learner>,allowPassword?:boolean):Promise<Learner|null>,

    updateOne(filter:Partial<Learner>,update:Partial<Learner>,allowPassword?:boolean):Promise<Learner|null>
};