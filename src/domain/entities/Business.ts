export interface Business{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    planId?:string;
    planStartDate?:Date;
    planEndDate?:Date;
    maxEmployees?:number;
    employees:string[];
    password?:string;
    profilePic?:string;
    googleId?:string;
}