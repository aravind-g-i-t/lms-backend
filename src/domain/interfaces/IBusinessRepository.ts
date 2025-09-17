import { Business } from "@domain/entities/Business";
import { findAllParams } from "./types";

export interface IBusinessRepository{
    create(business:Partial<Business>):Promise<Business>;
    findByEmail(email:string):Promise<Business | null>;
    findAll(params:findAllParams):Promise<any>;
    updateStatus(id:string):Promise<void>;
    findById(id:string):Promise<Business |null>;
    update(id:string,learner:Partial<Business>):Promise<Business|null>;
    findOne(params:Partial<Business>):Promise<Business|null>;
}