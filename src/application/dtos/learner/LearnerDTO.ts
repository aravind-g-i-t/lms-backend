

export interface LearnerForListing {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    profilePic: string|null;
}

export interface LearnerAsRaw{
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