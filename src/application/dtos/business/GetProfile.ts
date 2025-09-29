
export interface GetBusinessProfileResponseDTO {
    success: boolean;
    message: string;
    business:GetBusinessProfileDTO;
}

export interface GetBusinessProfileDTO{
    name:string;
    email:string;
    joiningDate:Date;
    verification:{
        status:"Not Submitted"|"Under Review"|"Verified"|"Rejected",
        remarks:string|null;
    };
    businessDomain:string|null;
    website:string|null;
    location:string|null;
    profilePic:string|null;
    hasPassword:boolean;
}






