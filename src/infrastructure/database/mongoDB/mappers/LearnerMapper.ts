import { LearnerDoc } from "../models/LearnerModel";
import { Learner } from "@domain/entities/Learner";

export class LearnerMapper {
  static toDomain(doc: LearnerDoc): Learner {
    
    return {
      id: doc._id.toString(), 
      name: doc.name,
      email: doc.email,
      walletBalance: doc.walletBalance,
      isActive: doc.isActive,
      password: doc.password,
      profilePic: doc.profilePic,
      googleId:doc.googleId
    };
  }

  static toPersistence(entity: Learner): Partial<LearnerDoc> {
    return {
      name: entity.name,
      email: entity.email,
      walletBalance: entity.walletBalance,
      isActive: entity.isActive,
      password: entity.password,
      profilePic: entity.profilePic,
    };
  }
}
