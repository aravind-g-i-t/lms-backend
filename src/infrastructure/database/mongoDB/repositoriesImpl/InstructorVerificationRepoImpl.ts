import { InstructorVerification } from "@domain/entities/InstructorVerification";
import { IInstructorVerificationRepository } from "@domain/interfaces/IInstructorVerificationRepository";
import { InstructorVerificationModel } from "../models/InstructorVerificationModel";
import { InstructorVerificationMapper } from "../mappers/InstructorVerificationMapper";
import { FindAllInstructorVerifications, FindAllParams } from "@domain/interfaces/types";
import { escapeRegExp } from "shared/utils/escapeRegExp";

export class InstructorVerificationRepositoryImpl implements IInstructorVerificationRepository {
  constructor() { }

  async create(data: Partial<InstructorVerification>): Promise<InstructorVerification> {
    const doc = new InstructorVerificationModel(data);
    await doc.save();

    return InstructorVerificationMapper.toDomain(doc);
  }

  async findAll(params: FindAllParams): Promise<FindAllInstructorVerifications> {
    const { page, search, status, limit } = params;
    const query: any = {};

    if (status) {
      query.status = status;
    }
    if (search?.trim().length) {
      const safe = escapeRegExp(search.trim()).slice(0, 100);
      query["instructor.name"] = { $regex: safe, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const result = await InstructorVerificationModel.aggregate([
      {
        $lookup: {
          from: "instructors",
          localField: "instructorId",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: "$instructor" },
      { $match: query },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                id: "$_id",
                _id: 0,
                name: "$instructor.name",
                profilePic: "$instructor.profilePic",
                status: "$status",
                appliedOn: "$createdAt",
                email: "$instructor.email",
                
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const docs = result[0].data;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      instructorVerifications: docs,
      totalPages,
      totalCount,
    };
  }

 


  async findByIdAndUpdate(id: string, update: Partial<InstructorVerification>): Promise<InstructorVerification | null> {
    const doc = await InstructorVerificationModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();

    if (!doc) {
      return null
    }
    return InstructorVerificationMapper.toDomain(doc);
  }

  async deleteById(id: string): Promise<void> {

  }


}