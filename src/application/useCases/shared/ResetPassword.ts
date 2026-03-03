import { IResetPasswordUseCase } from "@application/IUseCases/shared/IResetPassword";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { hashPassword } from "shared/utils/hash";

export class ResetPasswordUseCase implements IResetPasswordUseCase{
    constructor(
        private _learnerRepository: ILearnerRepository,
        private _instructorRepository: IInstructorRepository,
    ) { }

    async execute(role:string,email: string, password: string):Promise<void> {
        let repository;
        switch (role) {
            case 'learner':
                repository=this._learnerRepository;
                break;
            default :
                repository=this._instructorRepository;
                break;
        }
        const user=await repository.findByEmail(email);
        if(!user){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const hashedPassword=await hashPassword(password);
        await repository.findByIdAndUpdate(user.id,{password:hashedPassword});
    }
}