export interface Instructor{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    isVerified:boolean;
    walletBalance:number;
    joiningDate:Date;
    password?:string;
    profilePic?:string;
    resume?:string;
    googleId?:string;
    website?:string;
    bio?:string,
}