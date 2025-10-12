
export interface FindAllParams{

    page: number; 
    limit: number 
    search?: string; 
    status?: string;
}


export interface FindAllInstructorVerifications{
    instructorVerifications:InstructorVerification[],
    totalPages:number,
    totalCount:number,
}

interface InstructorVerification{
    id: string;
    name: string;
    email: string;
    status: "Pending"| "Verified" | "Rejected";
    appliedOn: Date;
    profilePic: string | null;
}