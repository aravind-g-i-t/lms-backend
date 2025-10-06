// infrastructure/database/mongo/mappers/OrganisationMapper.ts
import { Business } from "@domain/entities/Business";
import { BusinessDoc } from "../models/BusinessModel";

export class BusinessMapper {
  static toDomain(doc: BusinessDoc): Business {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      isActive: doc.isActive,
      joiningDate:doc.createdAt,
      employees: doc.employees,
      verification: {
        status: doc.verification.status,
        remarks: doc.verification.remarks ,
      },
      location:doc.location||null,
      businessDomain:doc.businessDomain||null,
      website:doc.website||null,
      planId: doc.planId || null,
      planStartDate: doc.planStartDate||null,
      planEndDate: doc.planEndDate|| null,
      maxEmployees: doc.maxEmployees|| null,
      password: doc.password||null,
      profilePic: doc.profilePic||null,
      googleId:doc.googleId||null,
      license:doc.license||null
    };
  }
  static toSecureDomain(doc: BusinessDoc): Business {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      isActive: doc.isActive,
      joiningDate:doc.createdAt,
      employees: doc.employees,
      verification: {
        status: doc.verification.status,
        remarks: doc.verification.remarks,
      },
      location:doc.location||null,
      businessDomain:doc.businessDomain||null,
      website:doc.website||null,
      planId: doc.planId || null,
      planStartDate: doc.planStartDate||null,
      planEndDate: doc.planEndDate|| null,
      maxEmployees: doc.maxEmployees|| null,
      password:null,
      profilePic: doc.profilePic||null,
      googleId:doc.googleId||null,
      license:doc.license||null
    };
  }

  // static toDocument(entity: Business): Partial<BusinessDoc> {
  //   return {
  //     name: entity.name,
  //     email: entity.email,
  //     isActive: entity.isActive,
  //     planId: entity.planId,
  //     planStartDate: entity.planStartDate,
  //     planEndDate: entity.planEndDate,
  //     maxEmployees: entity.maxEmployees,
  //     employees: entity.employees,
  //     password: entity.password,
  //     profilePic: entity.profilePic,
  //   };
  // }
}
