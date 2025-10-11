import { IAuthorizationService } from "@domain/interfaces/IAuthorizationService";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { logger } from "@infrastructure/logging/Logger";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class AuthorizationService implements IAuthorizationService {
  constructor(
    private learnerRepo: ILearnerRepository,
    private instructorRepo: IInstructorRepository,
    private businessRepo:IBusinessRepository
  ) {}

  async checkUserActive(userId: string, role: string): Promise<boolean> {

    if (role === "learner") {      
      const learner = await this.learnerRepo.findById(userId);
      if(!learner){
        logger.warn("Learner failed to fetch learner for status verification");
        throw new AppError("Failed to fetch learner for status verification.",STATUS_CODES.INTERNAL_SERVER_ERROR,false)
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
    if (role === "business") {
      const business = await this.businessRepo.findById(userId);
      if(!business){
        logger.warn("Learner failed to fetch learner for status verification");
        return false
      }
      
      return business.isActive;
    }
    return false;
  }
}
