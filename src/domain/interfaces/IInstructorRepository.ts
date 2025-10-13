
import { Instructor } from "@domain/entities/Instructor";
import { FindAllInstructorsOutput, FindAllInstructorsQuery, FindAllOptions } from "@domain/types";



export interface IInstructorRepository{
    
    findByEmail(email:string,allowPassword?:boolean):Promise<Instructor | null>;
    
    findById(id:string,allowPassword?:boolean):Promise<Instructor |null>;
    
    findAll(
        query: FindAllInstructorsQuery, 
        options: FindAllOptions
    ):Promise<FindAllInstructorsOutput>;
    
    findByIdAndUpdate(id:string,instructor:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

    findOne(params:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

    updateOne(filter:Partial<Instructor>,update:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>

    updateStatus(id:string):Promise<Instructor|null>;

    create(instructor:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

}