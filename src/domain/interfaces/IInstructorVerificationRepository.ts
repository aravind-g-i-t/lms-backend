import { InstructorVerification } from "@domain/entities/InstructorVerification";
import { FindAllInstructorVerifications, FindAllParams } from "./types";


export interface IInstructorVerificationRepository{
    create(instructor:Partial<InstructorVerification>,allowPassword?:boolean):Promise<InstructorVerification|null>;

    findAll(params:FindAllParams):Promise<FindAllInstructorVerifications>;

    findByIdAndUpdate(id:string,update:Partial<InstructorVerification>):Promise<InstructorVerification|null>;

    deleteById(id:string):Promise<void>;
}