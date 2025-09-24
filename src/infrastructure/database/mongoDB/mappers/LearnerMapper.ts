import { LearnerDoc } from "../models/LearnerModel";
import { Learner } from "@domain/entities/Learner";

export class LearnerMapper {
  static toDomain(doc: LearnerDoc): Learner {
    
    return {
      id: doc._id.toString(), 
      name: doc.name,
      email: doc.email,
      joiningDate:doc.createdAt,
      walletBalance: doc.walletBalance,
      isActive: doc.isActive,
      password: doc.password||null,
      profilePic: doc.profilePic||null,
      googleId:doc.googleId||null,
    };
  }

  static toSecureDomain(doc: LearnerDoc): Learner {
    
    return {
      id: doc._id.toString(), 
      name: doc.name,
      email: doc.email,
      joiningDate:doc.createdAt,
      walletBalance: doc.walletBalance,
      isActive: doc.isActive,
      password:null,
      profilePic: doc.profilePic||null,
      googleId:doc.googleId||null,
    };
  }

  // static toPersistence(entity: Learner): Partial<LearnerDoc> {
  //   return {
  //     name: entity.name,
  //     email: entity.email,
  //     walletBalance: entity.walletBalance,
  //     isActive: entity.isActive,
  //     password: entity.password,
  //     profilePic: entity.profilePic,
  //   };
  // }
}
