import { BusinessForListing } from "@application/IUseCases/business/IGetBusinesses";
import { Business } from "@domain/entities/Business";

type BusinessQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
  "verification.status"?: string;
};

export interface IBusinessRepository{
    findById(id:string,allowPassword?:boolean):Promise<Business |null>;

    findByEmail(email:string,allowPassword?:boolean):Promise<Business | null>;

    findOne(params:Partial<Business>,allowPassword?:boolean):Promise<Business|null>;

    findAll(
        query: BusinessQuery, 
        options: { page: number; limit: number }
    ):Promise<{businesses:BusinessForListing[],totalPages: number; totalCount: number}>;

    findByIdAndUpdate(id:string,learner:Partial<Business>,allowPassword?:boolean):Promise<Business|null>;

    create(business:Partial<Business>,allowPassword?:boolean):Promise<Business>;

    updateStatus(id:string):Promise<void>;

    updateOne(filter:Partial<Business>,update:Partial<Business>,allowPassword?:boolean):Promise<Business|null>
};