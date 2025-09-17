// infrastructure/database/mongo/mappers/OrganisationMapper.ts
import { Business } from "@domain/entities/Business";
import { BusinessDoc } from "../models/BusinessModel";

export class BusinessMapper {
  static toEntity(doc: BusinessDoc): Business {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      isActive: doc.isActive,
      planId: doc.planId,
      planStartDate: doc.planStartDate,
      planEndDate: doc.planEndDate,
      maxEmployees: doc.maxEmployees,
      employees: doc.employees,
      password: doc.password,
      profilePic: doc.profilePic,
      googleId:doc.googleId
    };
  }

  static toDocument(entity: Business): Partial<BusinessDoc> {
    return {
      name: entity.name,
      email: entity.email,
      isActive: entity.isActive,
      planId: entity.planId,
      planStartDate: entity.planStartDate,
      planEndDate: entity.planEndDate,
      maxEmployees: entity.maxEmployees,
      employees: entity.employees,
      password: entity.password,
      profilePic: entity.profilePic,
    };
  }
}
