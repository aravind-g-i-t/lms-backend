import { Instructor } from "@domain/entities/Instructor";


export interface IInstructorGoogleSigninUseCase {
    execute(token: string):Promise<InstructorGoogleSigninOutput>
}

export interface InstructorGoogleSigninOutput{
    user:Instructor;
    accessToken:string;
    refreshToken:string;
    role:'instructor';
}

