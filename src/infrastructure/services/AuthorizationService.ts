import { IAuthorizationService } from "@domain/interfaces/IAuthorizationService";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";

export class AuthorizationService implements IAuthorizationService {
  constructor(
    private learnerRepo: ILearnerRepository,
    private instructorRepo: IInstructorRepository,
    private businessRepo:IBusinessRepository
  ) {}

  async checkUserActive(userId: string, role: string): Promise<boolean> {
    if (role === "learner") {
      console.log('checking',userId,role);
      
      const learner = await this.learnerRepo.findById(userId);
      console.log(learner);
      
      return learner?.isActive ?? false;
    }
    if (role === "instructor") {
      const instructor = await this.instructorRepo.findById(userId);
      return instructor?.isActive ?? false;
    }
    if (role === "business") {
      const business = await this.businessRepo.findById(userId);
      return business?.isActive ?? false;
    }
    return false;
  }
}
