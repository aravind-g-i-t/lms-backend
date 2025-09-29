export interface GetInstructorProfileResponseDTO {
    success: boolean;
    message: string;
    instructor:GetInstructorProfileDTO;
}

export interface GetInstructorProfileDTO{
    name:string;
    email:string;
    verification:{
        status:"Not Submitted"|"Under Review"|"Verified"|"Rejected",
        remarks:string|null;
    };
    profilePic:string|null;
    joiningDate:Date|null;
    website:string|null;
    bio:string|null;
    hasPassword:boolean;
    designation:string|null;
    expertise:string[];
    resume:string|null;
    rating:number|null
}