export interface Instructor{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    walletBalance:number;
    joiningDate:Date;
    expertise:string[];
    verification:{
        status:"Not Submitted"|"Under Review"|"Verified"|"Rejected",
        remarks:string|null;
    };
    rating:number|null;
    designation:string |null;
    password:string|null;
    profilePic:string|null;
    resume:string|null;
    googleId:string|null;
    website:string|null;
    bio:string|null;
}