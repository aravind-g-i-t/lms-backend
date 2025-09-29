
import { Instructor } from "@domain/entities/Instructor";
import { FindAllParams } from "./types";

interface FindAllResponse{
    instructors:Instructor[],
    totalPages:number,
    totalCount:number,
}

export interface IInstructorRepository{
    
    findByEmail(email:string,allowPassword?:boolean):Promise<Instructor | null>;
    
    findById(id:string,allowPassword?:boolean):Promise<Instructor |null>;
    
    findAll(
        query: Record<string, any>, 
        options: { page: number; limit: number }
    ):Promise<FindAllResponse>;
    
    findByIdAndUpdate(id:string,instructor:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

    findOne(params:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

    updateOne(filter:Partial<Instructor>,update:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>

    updateStatus(id:string):Promise<void>;

    create(instructor:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor>;

}