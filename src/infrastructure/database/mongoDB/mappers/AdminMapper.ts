// infrastructure/database/mongo/mappers/OrganisationMapper.ts
import { Admin } from "@domain/entities/Admin";
import { AdminDocument } from "../models/AdminModel";

export class AdminMapper {
  static toEntity(doc: AdminDocument|null): Admin|null {
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
    };
  }

  static toDocument(entity: Admin): Partial<AdminDocument> {
    return {
      email: entity.email,
      password: entity.password,
    };
  }
}
