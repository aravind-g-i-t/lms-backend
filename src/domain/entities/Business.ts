export interface Business{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    employees:string[];
    joiningDate:Date;
    verification:{
        status:"Not Submitted"|"Under Review"|"Verified"|"Rejected",
        remarks:string|null;
    };
    businessDomain:string|null;
    website:string|null;
    location:string|null;
    planId:string|null;
    planStartDate:Date|null;
    planEndDate:Date|null;
    maxEmployees:number|null;
    password:string|null;
    profilePic:string|null;
    googleId:string|null;
}