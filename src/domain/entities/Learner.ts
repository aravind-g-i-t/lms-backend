export interface Learner{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    walletBalance:number;
    password:string|null;
    profilePic:string|null;
    googleId:string|null;
    joiningDate:Date|null;
}