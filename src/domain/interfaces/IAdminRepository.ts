import { Admin } from "@domain/entities/Admin";

export interface IAdminRepository{
    findByEmail(email:string):Promise<Admin|null>;
    findById(id:string):Promise<Admin |null>
    
}