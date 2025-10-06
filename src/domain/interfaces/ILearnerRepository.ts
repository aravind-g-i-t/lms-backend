import { Learner } from "@domain/entities/Learner";

type LearnerQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
};

interface FindAllResponse{
    learners:Learner[],
    totalPages:number,
    totalCount:number,
}

export interface ILearnerRepository{
    findByEmail(email:string,allowPassword?:boolean):Promise<Learner | null>;

    findOne(params:Partial<Learner>,allowPassword?:boolean):Promise<Learner|null>;

    findById(id:string,allowPassword?:boolean):Promise<Learner |null>

    findAll(
        query:LearnerQuery, 
        options: { page: number; limit: number }
    ):Promise<FindAllResponse>;

    create(learner:Partial<Learner>,allowPassword?:boolean):Promise<Learner>;

    updateStatus(id:string):Promise<void>;

    findByIdAndUpdate(id:string,learner:Partial<Learner>,allowPassword?:boolean):Promise<Learner|null>,

    updateOne(filter:Partial<Learner>,update:Partial<Learner>,allowPassword?:boolean):Promise<Learner|null>
};