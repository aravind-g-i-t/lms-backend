import { Instructor } from "@domain/entities/Instructor";


export interface InstructorSigninUseCaseOutput{
    user:Instructor;
    accessToken:string;
    refreshToken:string;
    role:'learner'|'instructor'|'business'
}

export interface IInstructorSigninUseCase {
    execute(input: {email:string,password:string,role:'learner'|'instructor'|'business'}):Promise<InstructorSigninUseCaseOutput>
}
