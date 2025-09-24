export interface GetLearnerProfileResponseDTO {
    success: boolean;
    message: string;
    learner:GetLearnerProfileDTO;
}

export interface GetLearnerProfileDTO{
    name:string;
    email:string;
    profilePic:string|null;
    joiningDate:Date|null;
    hasPassword:boolean
}