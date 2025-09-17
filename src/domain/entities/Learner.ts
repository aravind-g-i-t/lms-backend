export interface Learner{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    walletBalance:number;
    password?:string;
    profilePic?:string;
    googleId?:string
}