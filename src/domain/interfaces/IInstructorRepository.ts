
import { Instructor } from "@domain/entities/Instructor";

type InstructorQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
  "verification.status"?: string;
};

interface FindAllResponse{
    instructors:Instructor[],
    totalPages:number,
    totalCount:number,
}

export interface IInstructorRepository{
    
    findByEmail(email:string,allowPassword?:boolean):Promise<Instructor | null>;
    
    findById(id:string,allowPassword?:boolean):Promise<Instructor |null>;
    
    findAll(
        query: InstructorQuery, 
        options: { page: number; limit: number }
    ):Promise<FindAllResponse>;
    
    findByIdAndUpdate(id:string,instructor:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

    findOne(params:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

    updateOne(filter:Partial<Instructor>,update:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>

    updateStatus(id:string):Promise<Instructor|null>;

    create(instructor:Partial<Instructor>,allowPassword?:boolean):Promise<Instructor|null>;

}