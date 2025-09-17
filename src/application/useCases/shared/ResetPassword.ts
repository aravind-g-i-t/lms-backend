import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { hashPassword } from "shared/utils/hash";

export class ResetPasswordUseCase {
    constructor(
        private _learnerRepository: ILearnerRepository,
        private _instructorRepository: IInstructorRepository,
        private _businessRepository: IBusinessRepository
    ) { }

    async execute(role:string,email: string, password: string) {
        let repository;
        switch (role) {
            case 'learner':
                repository=this._learnerRepository;
                break;
            case 'instructor':
                repository=this._instructorRepository;
                break;
            default:
                repository=this._businessRepository;
                break;
        }
        const user=await repository.findByEmail(email);
        if(!user){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const hashedPassword=await hashPassword(password);
        await repository.update(user.id,{password:hashedPassword});
    }
}