export interface GetInstructorProfileResponseDTO {
    success: boolean;
    message: string;
    instructor:GetInstructorProfileDTO;
}

export interface GetInstructorProfileDTO{
    name:string;
    email:string;
    profilePic:string|null;
    joiningDate:Date|null;
    website:string|null;
    bio:string|null;
    isVerified:boolean;
    hasPassword:boolean;
    designation:string|null;
    expertise:string[];
    resume:string|null;
    rating:number|null
}