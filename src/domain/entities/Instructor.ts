export interface Instructor{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    isVerified:boolean;
    walletBalance:number;
    joiningDate:Date;
    expertise:string[]
    rating:number|null;
    designation:string |null;
    password:string|null;
    profilePic:string|null;
    resume:string|null;
    googleId:string|null;
    website:string|null;
    bio:string|null;
}