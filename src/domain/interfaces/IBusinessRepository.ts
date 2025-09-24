import { Business } from "@domain/entities/Business";
import { FindAllParams } from "./types";

export interface IBusinessRepository{
    findById(id:string,allowPassword?:boolean):Promise<Business |null>;

    findByEmail(email:string,allowPassword?:boolean):Promise<Business | null>;

    findOne(params:Partial<Business>,allowPassword?:boolean):Promise<Business|null>;

    findAll(params:FindAllParams,allowPassword?:boolean):Promise<any>;

    findByIdAndUpdate(id:string,learner:Partial<Business>,allowPassword?:boolean):Promise<Business|null>;

    create(business:Partial<Business>,allowPassword?:boolean):Promise<Business>;

    updateStatus(id:string):Promise<void>;

    updateOne(filter:Partial<Business>,update:Partial<Business>,allowPassword?:boolean):Promise<Business|null>
};