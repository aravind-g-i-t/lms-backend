import { IAuthorizationService } from "@domain/interfaces/IAuthorizationService";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { logger } from "@infrastructure/logging/Logger";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class AuthorizationService implements IAuthorizationService {
  constructor(
    private learnerRepo: ILearnerRepository,
    private instructorRepo: IInstructorRepository,
  ) {}

  async checkUserActive(userId: string, role: string): Promise<boolean> {

    if (role === "learner") {      
      const learner = await this.learnerRepo.findById(userId);
      if(!learner){
        logger.warn("Learner failed to fetch learner for status verification");
        throw new AppError(MESSAGES.LEARNER_NOT_FOUND,STATUS_CODES.NOT_FOUND)
      }
      return learner.isActive;
    }
    if (role === "instructor") {
      const instructor = await this.instructorRepo.findById(userId);
      if(!instructor){
        logger.warn("Learner failed to fetch learner for status verification");
        return false
      }
      
      return instructor.isActive;
    }
    return false;
  }
}
