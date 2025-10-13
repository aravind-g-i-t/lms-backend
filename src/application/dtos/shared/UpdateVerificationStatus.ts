export interface UpdateVerificationStatusInputDTO{
    id:string; 
    status: "Verified"|"Rejected"; 
    remarks: string|null; 
}
