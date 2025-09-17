
import { Instructor } from "@domain/entities/Instructor";
import { findAllParams } from "./types";

interface FindAllResponse{
    instructors:Instructor[],
    totalPages:number,
    totalCount:number,
}

export interface IInstructorRepository{
    create(instructor:Partial<Instructor>):Promise<Instructor>;
    findByEmail(email:string):Promise<Instructor | null>;
    findById(id:string):Promise<Instructor |null>;
    findAll(params:findAllParams):Promise<FindAllResponse>;
    updateStatus(id:string):Promise<void>;
    update(id:string,instructor:Partial<Instructor>):Promise<Instructor|null>;
    findOne(params:Partial<Instructor>):Promise<Instructor|null>;
}